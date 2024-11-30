// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffectIgnoreInitial } from '@w3ux/hooks';
import { appendOrEmpty } from '@w3ux/utils';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';
import { useHelp } from 'contexts/Help';
import { useLedgerHardware } from 'contexts/LedgerHardware';
import type { LedgerResponse } from 'contexts/LedgerHardware/types';
import { useOverlay } from 'kits/Overlay/Provider';
import { EstimatedTxFee } from 'library/EstimatedTxFee';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonHelp } from 'ui-buttons';
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
  notEnoughFunds,
}: SubmitProps & { buttons?: ReactNode[]; notEnoughFunds: boolean }) => {
  const { t } = useTranslation('library');
  const {
    setFeedback,
    getFeedback,
    integrityChecked,
    handleUnmount,
    getIsExecuting,
    getStatusCode,
    resetStatusCode,
    runtimesInconsistent,
    transportResponse,
    setStatusCode,
  } = useLedgerHardware();
  const { openHelp } = useHelp();
  const { setModalResize } = useOverlay().modal;
  const { accountHasSigner } = useImportedAccounts();

  // Handle new Ledger status report.
  const handleLedgerStatusResponse = (response: LedgerResponse) => {
    if (!response) {
      return;
    }
    const { ack, statusCode, body } = response;

    if (statusCode === 'SignedPayload') {
      if (uid !== body.uid) {
        // UIDs do not match, so this is not the transaction we are waiting for.
        setFeedback(t('wrongTransaction'), 'Wrong Transaction');
      } else {
        setStatusCode(ack, statusCode);
      }
      // Reset state pertaining to this transaction.
      resetStatusCode();
    } else {
      setStatusCode(ack, statusCode);
    }
  };

  // Get the latest Ledger loop feedback.
  const feedback = getFeedback();

  // The state under which submission is disabled.
  const disabled =
    !accountHasSigner(submitAddress) ||
    !valid ||
    submitting ||
    notEnoughFunds ||
    getIsExecuting();

  // Resize modal on content change.
  useEffect(() => {
    setModalResize();
  }, [
    integrityChecked,
    valid,
    submitting,
    notEnoughFunds,
    getStatusCode(),
    getIsExecuting(),
  ]);

  // Listen for new Ledger status reports.
  useEffectIgnoreInitial(() => {
    handleLedgerStatusResponse(transportResponse);
  }, [transportResponse]);

  // Tidy up context state when this component is no longer mounted.
  useEffect(
    () => () => {
      handleUnmount();
    },
    []
  );

  return (
    <>
      <div>
        <EstimatedTxFee uid={uid} />
      </div>
      {runtimesInconsistent && (
        <div className="inner warning">
          <div>
            <p className="prompt">
              {t('ledgerAppOutOfDate')}
              <ButtonHelp
                onClick={() =>
                  openHelp('Ledger App Not on Latest Runtime Version')
                }
              />
            </p>
          </div>
        </div>
      )}
      <div
        className={`inner msg${appendOrEmpty(displayFor === 'card', 'col')}`}
      >
        <div>
          {valid ? (
            <p className="prompt">
              <FontAwesomeIcon icon={faCircleExclamation} className="icon" />
              {feedback?.message
                ? feedback.message
                : !integrityChecked
                  ? t('ledgerConnectAndConfirm')
                  : `${t('deviceVerified')}. ${t('submitTransaction')}`}
              {feedback?.helpKey && (
                <ButtonHelp
                  marginLeft
                  onClick={() => {
                    if (feedback?.helpKey) {
                      openHelp(feedback.helpKey);
                    }
                  }}
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
            disabled={disabled}
          />
        </div>
      </div>
    </>
  );
};
