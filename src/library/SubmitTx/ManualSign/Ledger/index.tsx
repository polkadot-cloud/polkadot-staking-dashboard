// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ButtonHelp } from '@polkadot-cloud/react';
import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLedgerHardware } from 'contexts/Hardware/Ledger';
import type { LedgerResponse } from 'contexts/Hardware/types';
import { useHelp } from 'contexts/Help';
import { useTxMeta } from 'contexts/TxMeta';
import { EstimatedTxFee } from 'library/EstimatedTxFee';
import { useOverlay } from '@polkadot-cloud/react/hooks';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';
import type { SubmitProps } from '../../types';
import { Submit } from './Submit';

export const Ledger = ({
  uid,
  onSubmit,
  submitting,
  valid,
  submitText,
  buttons,
  submitAddress,
  displayFor,
}: SubmitProps & { buttons?: ReactNode[] }) => {
  const { t } = useTranslation('library');
  const {
    isPaired,
    setFeedback,
    getFeedback,
    integrityChecked,
    handleUnmount,
    setIsExecuting,
    getIsExecuting,
    getStatusCodes,
    resetStatusCodes,
    transportResponse,
    handleNewStatusCode,
  } = useLedgerHardware();
  const { openHelp } = useHelp();
  const { accountHasSigner } = useImportedAccounts();
  const { setModalResize } = useOverlay().modal;
  const { txFeesValid } = useTxMeta();
  const { setTxSignature } = useTxMeta();

  // Ledger loop needs to keep track of whether this component is mounted. If it is unmounted then
  // the loop will cancel & ledger metadata will be cleared up. isMounted needs to be given as a
  // function so the interval fetches the real value.
  const isMounted = useRef<boolean>(true);

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

      // Reset state pertaining to this transaction.
      setIsExecuting(false);
    } else {
      handleNewStatusCode(ack, statusCode);
    }
  };

  // Get the latest Ledger loop feedback.
  const feedback = getFeedback();

  // The state under which submission is disabled.
  const disabled =
    !accountHasSigner(submitAddress) ||
    !valid ||
    submitting ||
    !txFeesValid ||
    getIsExecuting();

  // Resize modal on content change.
  useEffect(() => {
    setModalResize();
  }, [isPaired, getStatusCodes(), integrityChecked]);

  // Listen for new Ledger status reports.
  useEffect(() => {
    if (getIsExecuting()) handleLedgerStatusResponse(transportResponse);
  }, [transportResponse]);

  // Tidy up context state when this component is no longer mounted.
  useEffect(() => {
    return () => {
      isMounted.current = false;
      handleUnmount();
    };
  }, []);

  return (
    <div className="inner strong">
      <div className="strong">
        <EstimatedTxFee />
        {valid ? (
          <p className="prompt">
            {disabled
              ? '...'
              : !integrityChecked
              ? 'Connect your Ledger device and confirm it is connected.'
              : feedback?.message || t('submitTransaction')}
            {feedback?.helpKey && (
              <ButtonHelp
                marginLeft
                onClick={() => {
                  if (feedback?.helpKey) openHelp(feedback.helpKey);
                }}
                background="secondary"
              />
            )}
          </p>
        ) : (
          <p className="prompt">...</p>
        )}
      </div>
      <div>
        {buttons}
        <Submit
          displayFor={displayFor}
          submitting={submitting}
          submitText={submitText}
          onSubmit={onSubmit}
          isMounted={isMounted.current}
          disabled={disabled}
        />
      </div>
    </div>
  );
};
