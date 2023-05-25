// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  faArrowAltCircleUp,
  faSquarePen,
} from '@fortawesome/free-solid-svg-icons';
import { ButtonSubmit } from '@polkadotcloud/core-ui';
import { useConnect } from 'contexts/Connect';
import { useOverlay } from 'contexts/Overlay';
import { useTxMeta } from 'contexts/TxMeta';
import { EstimatedTxFee } from 'library/EstimatedTxFee';
import React from 'react';
import { useTranslation } from 'react-i18next';
import type { SubmitProps } from '../../types';
import { SignOverlay } from './SignOverlay';

export const Vault = ({
  onSubmit,
  submitting,
  valid,
  submitText,
  buttons,
  submitAddress,
}: SubmitProps & { buttons?: React.ReactNode[] }) => {
  const { t } = useTranslation('library');
  const { accountHasSigner } = useConnect();
  const { txFeesValid, getTxSignature } = useTxMeta();
  const { openOverlayWith, status: overlayStatus } = useOverlay();

  // The state under which submission is disabled.
  const disabled =
    submitting || !valid || !accountHasSigner(submitAddress) || !txFeesValid;

  return (
    <>
      <div>
        <EstimatedTxFee />
        {valid ? <p>{t('submitTransaction')}</p> : <p>...</p>}
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
