// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faSquarePen } from '@fortawesome/free-solid-svg-icons';
import { ButtonHelp, ButtonSubmit } from '@polkadot-cloud/react';
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useConnect } from 'contexts/Connect';
import type { LedgerAccount } from 'contexts/Connect/types';
import { useLedgerHardware } from 'contexts/Hardware/Ledger';
import type { LedgerResponse } from 'contexts/Hardware/types';
import { useHelp } from 'contexts/Help';
import { useModal } from 'contexts/Modal';
import { useTxMeta } from 'contexts/TxMeta';
import { EstimatedTxFee } from 'library/EstimatedTxFee';
import { useLedgerLoop } from 'library/Hooks/useLedgerLoop';
import type { SubmitProps } from '../types';

export const Ledger = ({
  uid,
  onSubmit,
  submitting,
  valid,
  submitText,
  buttons,
  submitAddress,
}: SubmitProps & { buttons?: React.ReactNode[] }) => {
  const { t } = useTranslation('library');
  const {
    pairDevice,
    transportResponse,
    setIsExecuting,
    resetStatusCodes,
    getIsExecuting,
    handleNewStatusCode,
    isPaired,
    getStatusCodes,
    getFeedback,
    setFeedback,
    handleUnmount,
  } = useLedgerHardware();
  const { openHelp } = useHelp();
  const { setResize } = useModal();
  const { activeAccount, accountHasSigner, getAccount } = useConnect();
  const { txFeesValid, setTxSignature, getTxSignature } = useTxMeta();

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
        setFeedback(t('wrongTransaction'), 'Wrong Transaction');
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

  // Tidy up context state when this component is no longer mounted.
  useEffect(() => {
    return () => {
      isMounted.current = false;
      handleUnmount();
    };
  }, []);

  // Get the latest Ledger loop feedback.
  const feedback = getFeedback();

  // Help key based on Ledger status.
  const helpKey = feedback?.helpKey;

  // The state under which submission is disabled.
  const disabled =
    submitting || !valid || !accountHasSigner(submitAddress) || !txFeesValid;

  return (
    <>
      <div>
        <EstimatedTxFee />
        {valid ? (
          <p>
            {feedback?.message || t('submitTransaction')}
            {helpKey ? (
              <ButtonHelp
                marginLeft
                onClick={() => openHelp(helpKey)}
                backgroundSecondary
              />
            ) : null}
          </p>
        ) : (
          <p>...</p>
        )}
      </div>
      <div>
        {buttons}
        {getTxSignature() !== null || submitting ? (
          <ButtonSubmit
            text={submitText || ''}
            iconLeft={faSquarePen}
            iconTransform="grow-2"
            onClick={() => onSubmit()}
            disabled={disabled}
            pulse={!(disabled || getIsExecuting())}
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
            disabled={disabled || getIsExecuting()}
            pulse={!(disabled || getIsExecuting())}
          />
        )}
      </div>
    </>
  );
};
