// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { QrDisplayPayload, QrScanSignature } from '@polkadot/react-qr';
import { ButtonPrimary, ButtonSecondary } from '@polkadotcloud/core-ui';
import { useOverlay } from 'contexts/Overlay';
import { useTxMeta } from 'contexts/TxMeta';
import { QRViewerWrapper } from 'library/Import/Wrappers';
import type { SignerOverlayProps } from 'library/SubmitTx/types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { AnyJson } from 'types';

export const SignOverlay = ({ submitAddress }: SignerOverlayProps) => {
  const { t } = useTranslation('library');
  const { getTxPayload, setTxSignature } = useTxMeta();
  const payload = getTxPayload();
  const payloadU8a = payload?.toU8a();
  const { setStatus: setOverlayStatus } = useOverlay();

  // Whether user is on sign or submit stage.
  const [stage, setStage] = useState(1);

  return (
    <QRViewerWrapper>
      {stage === 1 && <h3 className="title">{t('scanPolkadotVault')}</h3>}
      {stage === 2 && <h3 className="title">{t('signPolkadotVault')}</h3>}

      <div className="progress">
        <span className={stage === 1 ? 'active' : undefined}>Scan</span>
        <FontAwesomeIcon
          icon={faChevronRight}
          transform="shrink-4"
          className="arrow"
        />
        <span className={stage === 2 ? 'active' : undefined}>Sign</span>
      </div>
      {stage === 1 && (
        <div className="viewer withBorder">
          <QrDisplayPayload
            address={submitAddress || ''}
            cmd={2}
            genesisHash={payload?.genesisHash}
            payload={payloadU8a}
            style={{ width: '100%', maxWidth: 250 }}
          />
        </div>
      )}
      {stage === 2 && (
        <div className="viewer">
          <QrScanSignature
            size={279}
            onScan={({ signature }: AnyJson) => {
              setOverlayStatus(0);
              setTxSignature(signature);
            }}
          />
        </div>
      )}
      <div className="foot">
        <div>
          {stage === 2 && (
            <ButtonSecondary
              text={t('backToScan')}
              lg
              onClick={() => setStage(1)}
              iconLeft={faChevronLeft}
              iconTransform="shrink-3"
            />
          )}
          {stage === 1 && (
            <ButtonPrimary
              text={t('iHaveScanned')}
              lg
              onClick={() => {
                setStage(2);
              }}
              iconRight={faChevronRight}
              iconTransform="shrink-3"
            />
          )}
          <ButtonSecondary
            text={t('cancel')}
            lg
            marginLeft
            onClick={() => setOverlayStatus(0)}
          />
        </div>
      </div>
    </QRViewerWrapper>
  );
};
