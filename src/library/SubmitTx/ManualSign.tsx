// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  faArrowAltCircleUp,
  faSquarePen,
} from '@fortawesome/free-solid-svg-icons';
import { ButtonHelp, ButtonSubmit } from '@polkadotcloud/dashboard-ui';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import type { LedgerAccount } from 'contexts/Connect/types';
import { useLedgerHardware } from 'contexts/Hardware/Ledger';
import { getLedgerApp } from 'contexts/Hardware/Utils';
import type { LedgerResponse } from 'contexts/Hardware/types';
import { useHelp } from 'contexts/Help';
import { useModal } from 'contexts/Modal';
import { useTxMeta } from 'contexts/TxMeta';
import { EstimatedTxFee } from 'library/EstimatedTxFee';
import { useLedgerLoop } from 'library/Hooks/useLedgerLoop';
import { determineStatusFromCodes } from 'modals/LedgerImport/Utils';
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { TransactionMessageWrapper } from './Wrappers';
import type { SubmitProps } from './types';

export const ManualSign = ({
  uid,
  onSubmit,
  submitting,
  valid,
  submitText,
  buttons,
}: SubmitProps & { buttons?: Array<React.ReactNode> }) => {
  const { t } = useTranslation('library');
  const { network } = useApi();
  const {
    pairDevice,
    transportResponse,
    setIsExecuting,
    resetStatusCodes,
    getIsExecuting,
    handleNewStatusCode,
    isPaired,
    getStatusCodes,
    getDefaultMessage,
    setDefaultMessage,
    handleUnmount,
  } = useLedgerHardware();
  const { activeAccount, accountHasSigner, getAccount } = useConnect();
  const { txFeesValid, setTxSignature, getTxSignature } = useTxMeta();
  const { setResize } = useModal();
  const { appName } = getLedgerApp(network.name);

  const getAddressIndex = () => {
    return (getAccount(activeAccount) as LedgerAccount)?.index || 0;
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
    },
    mounted: getIsMounted,
  });

  // Handle new Ledger status report.
  const handleLedgerStatusResponse = (response: LedgerResponse) => {
    if (!response) return;
    const { ack, statusCode, body } = response;

    if (statusCode === 'SignedPayload') {
      if (uid !== body.uid) {
        // UIDs do not match, so this is not the transaction we are waiting for.
        setDefaultMessage(t('wrongTransaction'));
        resetStatusCodes();
        setTxSignature(null);
      } else {
        // Important: only set the signature (and therefore trigger the transaction submission) if
        // UIDs match.
        handleNewStatusCode(ack, statusCode);
        setTxSignature(body.sig);
        resetStatusCodes();
      }
      setIsExecuting(false);
    } else {
      handleNewStatusCode(ack, statusCode);
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

  // automatically submit transaction when it is signed
  useEffect(() => {
    if (getTxSignature() !== null) {
      onSubmit();
    }
  }, [getTxSignature()]);

  // Tidy up context state when this component is no longer mounted.
  useEffect(() => {
    return () => {
      isMounted.current = false;
      handleUnmount();
    };
  }, []);

  const statusCodes = getStatusCodes();
  const statusCodeTitle = determineStatusFromCodes(
    appName,
    statusCodes,
    false
  ).title;
  const fallbackMessage = t('submitTransaction');
  const defaultMessage = getDefaultMessage();
  const { openHelp } = useHelp();

  return (
    <>
      <div>
        <EstimatedTxFee />
        {valid ? (
          <TransactionMessageWrapper>
            {valid
              ? defaultMessage ||
                (!getIsExecuting() || !statusCodes.length
                  ? fallbackMessage
                  : statusCodeTitle)
              : fallbackMessage}
            {defaultMessage ===
            t('transactionRejectedPending', { ns: 'modals' }) ? (
              <ButtonHelp
                marginLeft
                onClick={() => openHelp('Ledger Rejected Transaction Options')}
                backgroundSecondary
              />
            ) : null}
          </TransactionMessageWrapper>
        ) : null}
      </div>
      <div>
        {buttons}
        {getTxSignature() !== null || submitting ? (
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
            text={getIsExecuting() ? t('signing') : t('sign')}
            iconLeft={faSquarePen}
            iconTransform="grow-2"
            onClick={async () => {
              const paired = await pairDevice();
              if (paired) {
                setIsExecuting(true);
                handleLedgerLoop();
              }
            }}
            disabled={
              submitting ||
              getIsExecuting() ||
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
