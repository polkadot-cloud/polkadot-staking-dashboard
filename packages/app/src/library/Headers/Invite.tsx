// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslation } from 'react-i18next'
import { useOverlay } from 'ui-overlay'
import { Item } from './Wrappers'

export const Invite = () => {
  const { t } = useTranslation('invite')
  const { openModal } = useOverlay().modal

  const handleOpenInviteModal = () => {
    openModal({
      key: 'InviteModal',
      options: {
        size: 'sm',
      },
    })
  }

  return (
    <Item
      onClick={handleOpenInviteModal}
      title={t('inviteToStake')}
      data-testid="invite-button"
    >
      <FontAwesomeIcon icon={faUserPlus} transform="shrink-2" />
    </Item>
  )
}
