// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCopy } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTooltip } from 'contexts/Tooltip'
import { Notifications } from 'controllers/Notifications'
import type { NotificationText } from 'controllers/Notifications/types'
import { useTranslation } from 'react-i18next'
import { HeaderButton } from 'ui-core/list'
import type { CopyAddressProps } from '../types'

export const CopyAddress = ({ address, outline }: CopyAddressProps) => {
  const { t } = useTranslation('library')
  const { setTooltipTextAndOpen } = useTooltip()

  const tooltipText = t('copyAddress')

  // copy address notification
  const notificationCopyAddress: NotificationText | null =
    address == null
      ? null
      : {
          title: t('addressCopiedToClipboard'),
          subtitle: address,
        }

  return (
    <HeaderButton outline={outline}>
      <button
        type="button"
        className="tooltip-trigger-element"
        data-tooltip-text={tooltipText}
        onMouseMove={() => setTooltipTextAndOpen(tooltipText)}
        onClick={() => {
          if (notificationCopyAddress) {
            Notifications.emit(notificationCopyAddress)
          }
          navigator.clipboard.writeText(address || '')
        }}
      >
        <FontAwesomeIcon icon={faCopy} transform="shrink-1" />
      </button>
    </HeaderButton>
  )
}
