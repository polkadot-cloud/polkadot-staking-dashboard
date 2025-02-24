// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { CompulsoryPluginsProd, PluginsList } from 'config/plugins'
import { usePlugins } from 'contexts/Plugins'
import { Title } from 'library/Modal/Title'
import { StatusButton } from 'library/StatusButton'
import { useTranslation } from 'react-i18next'
import { Padding } from 'ui-core/modal'
import { ContentWrapper } from '../Networks/Wrapper'

export const Settings = () => {
  const { plugins, togglePlugin } = usePlugins()
  const { t } = useTranslation()

  return (
    <>
      <Title title={t('settings', { ns: 'modals' })} />
      <Padding>
        <ContentWrapper>
          <h4>{t('togglePlugins', { ns: 'modals' })}</h4>
          {PluginsList.map((plugin) => {
            if (
              import.meta.env.PROD &&
              CompulsoryPluginsProd.includes(plugin)
            ) {
              return null
            }
            return (
              <StatusButton
                key={plugin}
                checked={plugins.includes(plugin)}
                label={t(`plugin.${plugin}`, { ns: 'app' })}
                onClick={() => togglePlugin(plugin)}
              />
            )
          })}
        </ContentWrapper>
      </Padding>
    </>
  )
}
