// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { capitalizeFirstLetter } from '@w3ux/utils'
import { NetworkList } from 'consts/networks'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { usePrompt } from 'contexts/Prompt'
import { getRpcEndpoints, setRpcEndpoints } from 'global-bus'
import { Title } from 'library/Prompt/Title'
import { PromptSelectItem } from 'library/Prompt/Wrappers'
import { useTranslation } from 'react-i18next'

export const ProvidersPrompt = () => {
  const { t } = useTranslation()
  const { network } = useNetwork()
  const { closePrompt } = usePrompt()
  const { getRpcEndpoint } = useApi()

  const rpcProviders = NetworkList[network].endpoints.rpc
  return (
    <>
      <Title title={t('rpcProviders', { ns: 'modals' })} />
      <div className="padded">
        <h4 className="subheading">
          {t('selectRpcProvider', {
            ns: 'modals',
            network: capitalizeFirstLetter(network),
          })}
        </h4>
        {Object.entries(rpcProviders)?.map(([key, url], i) => {
          const isDisabled = getRpcEndpoint(network) === key

          return (
            <PromptSelectItem
              key={`favorite_${i}`}
              className={isDisabled ? 'inactive' : undefined}
              onClick={() => {
                closePrompt()
                // NOTE: Currently, we can only update the relay chain RPC endpoint
                setRpcEndpoints(network, {
                  ...getRpcEndpoints(),
                  [network]: key,
                })
              }}
            >
              <h3>
                {key} {isDisabled && `  (${t('selected', { ns: 'modals' })})`}
              </h3>
              <h4>{url}</h4>
            </PromptSelectItem>
          )
        })}
      </div>
    </>
  )
}
