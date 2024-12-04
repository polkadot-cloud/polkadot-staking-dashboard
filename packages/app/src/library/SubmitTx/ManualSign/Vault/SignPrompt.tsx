// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Bytes } from '@polkadot-api/substrate-bindings'
import { useApi } from 'contexts/Api'
import { QRViewerWrapper } from 'library/Import/Wrappers'
import { QrDisplayPayload } from 'library/QRCode/DisplayPayload'
import { QrScanSignature } from 'library/QRCode/ScanSignature'
import type { SignerPromptProps } from 'library/SubmitTx/types'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonPrimary, ButtonSecondary } from 'ui-buttons'

export const SignPrompt = ({
  submitAddress,
  toSign,
  onComplete,
}: SignerPromptProps) => {
  const {
    chainSpecs: { genesisHash },
  } = useApi()
  const { t } = useTranslation('library')

  // Whether user is on sign or submit stage.
  const [stage, setStage] = useState<number>(1)

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
            genesisHash={Bytes(32).dec(genesisHash)}
            payload={toSign}
            style={{ width: '100%', maxWidth: 250 }}
          />
        </div>
      )}
      {stage === 2 && (
        <div className="viewer">
          <QrScanSignature
            size={279}
            onScan={({ signature }) => {
              onComplete('complete', signature)
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
                setStage(2)
              }}
              iconRight={faChevronRight}
              iconTransform="shrink-3"
            />
          )}
          <ButtonSecondary
            text={t('cancel')}
            lg
            marginLeft
            onClick={() => {
              onComplete('cancelled', null)
            }}
          />
        </div>
      </div>
    </QRViewerWrapper>
  )
}
