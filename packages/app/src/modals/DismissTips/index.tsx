// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { usePlugins } from 'contexts/Plugins'
import { useOverlay } from 'kits/Overlay/Provider'
import { ModalPadding } from 'kits/Overlay/structure/ModalPadding'
import { Title } from 'library/Modal/Title'
import { useTranslation } from 'react-i18next'
import { ButtonSubmit } from 'ui-buttons'

export const DismissTips = () => {
  const { t } = useTranslation('tips')
  const { togglePlugin } = usePlugins()
  const { setModalStatus } = useOverlay().modal

  return (
    <>
      <Title title={t('module.dismissTips')} />
      <ModalPadding horizontalOnly>
        <div
          style={{
            padding: '0 0.5rem 1.25rem 0.5rem',
            width: '100%',
          }}
        >
          <div>
            <h4>{t('module.dismissResult')}</h4>
            <h4>{t('module.reEnable')}</h4>
          </div>
          <div className="buttons">
            <ButtonSubmit
              marginRight
              text={t('module.disableTips')}
              onClick={() => {
                togglePlugin('tips')
                setModalStatus('closing')
              }}
            />
          </div>
        </div>
      </ModalPadding>
    </>
  )
}
