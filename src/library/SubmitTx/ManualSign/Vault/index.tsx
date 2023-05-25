// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  faArrowAltCircleUp,
  faSquarePen,
} from '@fortawesome/free-solid-svg-icons';
import { ButtonHelp, ButtonSubmit } from '@polkadotcloud/core-ui';
import { useConnect } from 'contexts/Connect';
import { useHelp } from 'contexts/Help';
import { useModal } from 'contexts/Modal';
import { useOverlay } from 'contexts/Overlay';
import { useTxMeta } from 'contexts/TxMeta';
import { EstimatedTxFee } from 'library/EstimatedTxFee';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { SubmitProps } from '../../types';
import { SignOverlay } from './SignOverlay';

export const Vault = ({
  uid,
  onSubmit,
  submitting,
  valid,
  submitText,
  buttons,
  submitAddress,
}: SubmitProps & { buttons?: React.ReactNode[] }) => {
  const { t } = useTranslation('library');
  const { setResize } = useModal();
  const { openHelp } = useHelp();
  const { accountHasSigner } = useConnect();
  const { txFeesValid, setTxSignature, getTxSignature } = useTxMeta();
  const { openOverlayWith, status: overlayStatus } = useOverlay();

  // TODO: implement
  const getVaultStatus = () => false;

  // TODO: implement
  const getFeedback: any = () => '';

  // Resize modal on content change.
  useEffect(() => {
    setResize();
  }, [getVaultStatus()]);

  // Get the latest Ledger loop feedback.
  const feedback = getFeedback();

  // Help key based on Ledger status.
  const helpKey = feedback?.helpKey;

  // The state under which submission is disabled.
  const disabled =
    submitting || !valid || !accountHasSigner(submitAddress) || !txFeesValid;

  // Handle new Vault report.
  const handleVaultStatusResponse = (response: any) => {
    if (!response) return;
    const { statusCode, body } = response;

    if (statusCode === 'SignedPayload') {
      if (uid !== body.uid) {
        // UIDs do not match, so this is not the transaction we are waiting for.
        // setFeedback(t('wrongTransaction'), 'Wrong Transaction');
        setTxSignature(null);
      } else {
        // Important: only set the signature (and therefore trigger the transaction submission) if
        // UIDs match.
        setTxSignature(body.sig);
      }
    }
  };

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
            text={`${submitText}`}
            iconLeft={faArrowAltCircleUp}
            iconTransform="grow-2"
            onClick={() => onSubmit()}
            disabled={disabled}
          />
        ) : (
          <ButtonSubmit
            text={overlayStatus === 0 ? t('sign') : t('signing')}
            iconLeft={faSquarePen}
            iconTransform="grow-2"
            onClick={async () => {
              openOverlayWith(<SignOverlay />, 'small');
            }}
            disabled={disabled || overlayStatus !== 0}
            pulse={!disabled || overlayStatus === 0}
          />
        )}
      </div>
    </>
  );
};
