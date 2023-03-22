// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  faArrowAltCircleUp,
  faSquarePen,
} from '@fortawesome/free-solid-svg-icons';
import { ButtonSubmit } from '@polkadotcloud/dashboard-ui';
import { useConnect } from 'contexts/Connect';
import { useLedgerHardware } from 'contexts/Hardware/Ledger';
import type { LedgerResponse } from 'contexts/Hardware/types';
import { useModal } from 'contexts/Modal';
import { useTxMeta } from 'contexts/TxMeta';
import { EstimatedTxFee } from 'library/EstimatedTxFee';
import { useLedgerLoop } from 'library/Hooks/useLedgerLoop';
import { determineStatusFromCodes } from 'modals/LedgerImport/Utils';
import React, { useEffect, useRef } from 'react';
import type { SubmitProps } from './types';

// TODO: integrate useLedgerLoop

export const ManualSign = ({
  getPayload,
  onSubmit,
  submitting,
  valid,
  submitText,
  buttons,
}: SubmitProps & { buttons?: Array<React.ReactNode> }) => {
  const {
    pairDevice,
    transportResponse,
    setIsExecuting,
    resetStatusCodes,
    getIsExecuting,
    handleNewStatusCode,
    isPaired,
    getStatusCodes,
    getTransport,
    getDefaultMessage,
    setDefaultMessage,
  } = useLedgerHardware();
  const { activeAccount, accountHasSigner } = useConnect();
  const { txFeesValid, setTxSignature, txSignature } = useTxMeta();
  const { setResize } = useModal();

  const getAddressIndex = () => {
    // TODO: get the index of the sender.
    return 0;
  };

  // Ledger loop needs to keep track of whether this component is mounted. If it is unmounted then
  // the loop will cancel & ledger metadata will be cleared up. isMounted needs to be given as a
  // function so the interval fetches the real value.
  const isMounted = useRef(true);
  const getIsMounted = () => isMounted.current;

  const { handleLedgerLoop } = useLedgerLoop({
    tasks: ['sign_tx'],
    options: {
      accountIndex: getAddressIndex,
      payload: getPayload,
    },
    mounted: getIsMounted,
  });

  // Handle new Ledger status report.
  const handleLedgerStatusResponse = (response: LedgerResponse) => {
    if (!response) return;
    const { ack, statusCode, body } = response;

    if (statusCode === 'SignedPayload') {
      handleNewStatusCode(ack, statusCode);
      setTxSignature(body);
      setIsExecuting(false);
      resetStatusCodes();
    }
  };

  // Resize modal on content change.
  useEffect(() => {
    setResize();
  }, [isPaired, getStatusCodes()]);

  // Listen for new Ledger status reports.
  useEffect(() => {
    if (getIsExecuting()) {
      handleLedgerStatusResponse(transportResponse);
    }
  }, [transportResponse]);

  // Tidy up context state when this component is no longer mounted.
  useEffect(() => {
    return () => {
      isMounted.current = false;
      resetStatusCodes();
      setIsExecuting(false);
      setDefaultMessage(null);
      if (getTransport()?.device?.opened) {
        getTransport().device.close();
      }
    };
  }, []);

  // Once the device is paired, start `handleLedgerLoop`.
  useEffect(() => {
    if (isPaired === 'paired') {
      setIsExecuting(true);
      handleLedgerLoop();
    }
  }, [isPaired]);

  const statusCodes = getStatusCodes();
  const statusCodeTitle = determineStatusFromCodes(statusCodes, false).title;

  const fallbackMessage = 'Connect your Ledger Device to Continue...';
  const defaultMessage = getDefaultMessage();

  const messageDisplay = valid
    ? defaultMessage ||
      (!getIsExecuting() || !statusCodes.length
        ? fallbackMessage
        : statusCodeTitle)
    : fallbackMessage;

  return (
    <>
      <div>
        <EstimatedTxFee />
        <p>{messageDisplay}</p>
      </div>
      <div>
        {buttons}
        {txSignature !== null ? (
          <ButtonSubmit
            text={`${submitText}`}
            iconLeft={faArrowAltCircleUp}
            iconTransform="grow-2"
            onClick={() => onSubmit()}
            disabled={
              submitting ||
              !valid ||
              !accountHasSigner(activeAccount) ||
              !txFeesValid
            }
          />
        ) : (
          <ButtonSubmit
            text="Sign"
            iconLeft={faSquarePen}
            iconTransform="grow-2"
            onClick={() => pairDevice()}
            disabled={
              submitting ||
              !valid ||
              !accountHasSigner(activeAccount) ||
              !txFeesValid
            }
          />
        )}
      </div>
    </>
  );
};
