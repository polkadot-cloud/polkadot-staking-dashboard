// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffectIgnoreInitial } from '@w3ux/hooks';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLedgerHardware } from 'contexts/LedgerHardware';
import type { LedgerResponse } from 'contexts/LedgerHardware/types';
import { useHelp } from 'contexts/Help';
import { useTxMeta } from 'contexts/TxMeta';
import { EstimatedTxFee } from 'library/EstimatedTxFee';
import { useOverlay } from 'kits/Overlay/Provider';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { useNetwork } from 'contexts/Network';
import { getLedgerApp } from 'contexts/LedgerHardware/Utils';
import type { SubmitProps } from '../../types';
import { Submit } from './Submit';
import { ButtonHelp } from 'kits/Buttons/ButtonHelp';
import { appendOrEmpty } from '@w3ux/utils';

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
  const { network } = useNetwork();
  const { txFeesValid } = useTxMeta();
  const { setTxSignature } = useTxMeta();
  const { setModalResize } = useOverlay().modal;
  const { accountHasSigner } = useImportedAccounts();
  const { appName } = getLedgerApp(network);

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
        setTxSignature(null);
      } else {
        // Important: only set the signature (and therefore trigger the transaction submission) if
        // UIDs match.
        setStatusCode(ack, statusCode);
        setTxSignature(body.sig);
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
    !txFeesValid ||
    getIsExecuting();

  // Resize modal on content change.
  useEffect(() => {
    setModalResize();
  }, [
    integrityChecked,
    valid,
    submitting,
    txFeesValid,
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
        <EstimatedTxFee />
      </div>

      {runtimesInconsistent && (
        <div className="inner warning">
          <div>
            <p className="prompt">
              {t('ledgerAppOutOfDate', { appName })}
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
