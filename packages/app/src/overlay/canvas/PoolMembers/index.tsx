// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { Members } from 'overlay/canvas/PoolMembers/Members'
import { CanvasFullScreenWrapper } from 'overlay/canvas/Wrappers'
import { useTranslation } from 'react-i18next'
import { ButtonPrimary } from 'ui-buttons'
import { useOverlay } from 'ui-overlay'

export const PoolMembers = () => {
  const { t } = useTranslation()
  const { closeCanvas } = useOverlay().canvas

  return (
    <CanvasFullScreenWrapper>
      <div className="head">
        <ButtonPrimary
          text={t('cancel', { ns: 'library' })}
          lg
          onClick={() => closeCanvas()}
          iconLeft={faTimes}
          style={{ marginLeft: '1.1rem' }}
        />
      </div>
      <h1>{t('poolMembers', { ns: 'modals' })}</h1>
      <Members />
    </CanvasFullScreenWrapper>
  )
}
