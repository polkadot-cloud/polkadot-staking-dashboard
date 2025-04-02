// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faHive } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffectIgnoreInitial } from '@w3ux/hooks'
import { Odometer } from '@w3ux/react-odometer'
import { capitalizeFirstLetter } from '@w3ux/utils'
import CloudIconSVG from 'assets/svg/icons/cloud.svg?react'
import BigNumber from 'bignumber.js'
import { useNetwork } from 'contexts/Network'
import { usePlugins } from 'contexts/Plugins'
import { usePrompt } from 'contexts/Prompt'
import { IGNORE_NETWORKS } from 'contexts/TokenPrice'
import { isCustomEvent } from 'controllers/utils'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Page } from 'ui-core/base'
import { useEventListener } from 'usehooks-ts'
import { Disclaimer } from './Disclaimer'
import { Status } from './Status'
import { TokenPrice } from './TokenPrice'
import { Summary, Wrapper } from './Wrappers'

export const MainFooter = () => {
  const { t } = useTranslation('app')
  const { plugins } = usePlugins()
  const { network } = useNetwork()
  const { openPromptWith } = usePrompt()
  const PRIVACY_URL = import.meta.env.VITE_PRIVACY_URL
  const DISCLAIMER_URL = import.meta.env.VITE_DISCLAIMER_URL
  const ORGANISATION = import.meta.env.VITE_ORGANISATION
  const LEGAL_DISCLOSURES_URL = import.meta.env.VITE_LEGAL_DISCLOSURES_URL

  // Store incoming block number.
  const [blockNumber, setBlockNumber] = useState<string>()

  const newBlockCallback = (e: Event) => {
    if (isCustomEvent(e)) {
      setBlockNumber(e.detail.blockNumber)
    }
  }

  const ref = useRef<Document>(document)
  useEventListener('new-block-number', newBlockCallback, ref)

  // Reset block number on network change.
  useEffectIgnoreInitial(() => {
    setBlockNumber('0')
  }, [network])

  return (
    <Page.Footer>
      <Wrapper className="page-padding container-width">
        <CloudIconSVG className="icon" />
        <Summary>
          <section>
            <p>
              {ORGANISATION === undefined
                ? capitalizeFirstLetter(network)
                : ORGANISATION}
            </p>
            <Status />
            {PRIVACY_URL !== undefined && (
              <p>
                <a href={PRIVACY_URL} target="_blank" rel="noreferrer">
                  {t('privacy')}
                </a>
              </p>
            )}
            {DISCLAIMER_URL !== undefined && (
              <p>
                <a href={DISCLAIMER_URL} target="_blank" rel="noreferrer">
                  {t('disclaimer')}
                </a>
              </p>
            )}
            {LEGAL_DISCLOSURES_URL !== undefined && (
              <p>
                <a
                  href={LEGAL_DISCLOSURES_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  {t('legalDisclosures')}
                </a>
              </p>
            )}
            <p>
              <button
                type="button"
                onClick={() => {
                  openPromptWith(<Disclaimer />)
                }}
              >
                {t('dashboardDisclaimer')}
              </button>
            </p>
          </section>
          <section>
            <div className="hide-small">
              {plugins.includes('staking_api') &&
                !IGNORE_NETWORKS.includes(network) && <TokenPrice />}
              {import.meta.env.MODE === 'development' && (
                <div className="stat last">
                  <FontAwesomeIcon icon={faHive} />
                  <Odometer
                    wholeColor="var(--text-color-secondary)"
                    value={new BigNumber(blockNumber || '0').toFormat()}
                    spaceBefore={'0.35rem'}
                  />
                </div>
              )}
            </div>
          </section>
        </Summary>
      </Wrapper>
    </Page.Footer>
  )
}
