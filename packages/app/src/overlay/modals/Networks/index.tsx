// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faChevronRight, faGlobe } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { capitalizeFirstLetter } from '@w3ux/utils'
import { getChainIcons } from 'assets'
import { getEnabledNetworks } from 'consts/util'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { usePrompt } from 'contexts/Prompt'
import { useUi } from 'contexts/UI'
import { setProviderType } from 'global-bus'
import { Title } from 'library/Modal/Title'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import type { NetworkId } from 'types'
import { ButtonTertiary } from 'ui-buttons'
import { Padding } from 'ui-core/modal'
import { useOverlay } from 'ui-overlay'
import { ProvidersPrompt } from './ProvidersPrompt'
import {
  ConnectionButton,
  ConnectionsWrapper,
  ContentWrapper,
  NetworkButton,
} from './Wrapper'

export const Networks = () => {
  const { t } = useTranslation('modals')
  const { isBraveBrowser } = useUi()
  const { openPromptWith } = usePrompt()
  const { network, switchNetwork } = useNetwork()
  const { providerType, getRpcEndpoint } = useApi()
  const { setModalStatus, setModalResize } = useOverlay().modal
  const networkKey = network

  const isLightClient = providerType === 'sc'

  // Likely never going to happen; here just to be safe.
  useEffect(() => setModalResize(), [isBraveBrowser])

  return (
    <>
      <Title title={t('networks')} icon={faGlobe} />
      <Padding>
        <ContentWrapper>
          <h4>{t('selectNetwork')}</h4>
          <div className="items">
            {Object.entries(getEnabledNetworks()).map(
              ([key, item], index: number) => {
                const inline = getChainIcons(key as NetworkId).inline
                const Svg = inline.svg
                const rpcDisabled = networkKey === key

                return (
                  <NetworkButton
                    $connected={networkKey === key}
                    disabled={rpcDisabled}
                    key={`network_switch_${index}`}
                    type="button"
                    onClick={() => {
                      if (networkKey !== key) {
                        switchNetwork(key as NetworkId)
                        setModalStatus('closing')
                      }
                    }}
                  >
                    <div style={{ width: '1.75rem' }}>
                      <Svg width={inline.size} height={inline.size} />
                    </div>
                    <h3>{capitalizeFirstLetter(item.name)}</h3>
                    {networkKey === key && (
                      <h4 className="selected">{t('selected')}</h4>
                    )}
                    <div>
                      <FontAwesomeIcon
                        transform="shrink-2"
                        icon={faChevronRight}
                      />
                    </div>
                  </NetworkButton>
                )
              }
            )}
          </div>
          <h4>{t('providerType')}</h4>
          <ConnectionsWrapper>
            <div>
              <ConnectionButton
                $connected={isLightClient}
                className="off"
                type="button"
                onClick={() => {
                  setProviderType('sc')
                  switchNetwork(networkKey as NetworkId)
                  setModalStatus('closing')
                }}
              >
                <h3>{t('lightClient')}</h3>
                {isLightClient && <h4 className="selected">{t('selected')}</h4>}
              </ConnectionButton>
            </div>
            <div>
              <ConnectionButton
                $connected={!isLightClient}
                disabled={!isLightClient}
                type="button"
                onClick={() => {
                  setProviderType('ws')
                  switchNetwork(networkKey as NetworkId)
                  setModalStatus('closing')
                }}
              >
                <h3>RPC</h3>
                {!isLightClient && (
                  <h4 className="selected">{t('selected')}</h4>
                )}
              </ConnectionButton>
              <div className="provider">
                <p>{t('provider')}:</p>
                <ButtonTertiary
                  text={getRpcEndpoint(network)}
                  onClick={() => openPromptWith(<ProvidersPrompt />)}
                  marginLeft
                />
              </div>
            </div>
          </ConnectionsWrapper>
        </ContentWrapper>
      </Padding>
    </>
  )
}
