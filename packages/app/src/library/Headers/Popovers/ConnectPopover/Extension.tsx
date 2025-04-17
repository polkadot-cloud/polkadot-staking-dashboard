// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { IconDefinition } from '@fortawesome/free-solid-svg-icons'
import {
  faPlugCircleExclamation,
  faPlugCircleXmark,
  faPlus,
} from '@fortawesome/free-solid-svg-icons'
import { ExtensionIcons } from '@w3ux/extension-assets/util'
import { useExtensionAccounts, useExtensions } from '@w3ux/react-connect-kit'
import { localStorageOrDefault } from '@w3ux/utils'
import { useTranslation } from 'react-i18next'
import { ButtonMonoInvert } from 'ui-buttons'
import { ConnectItem } from 'ui-core/popover'
import { useOverlay } from 'ui-overlay'
import type { ExtensionProps } from './types'

export const Extension = ({ extension, last, setOpen }: ExtensionProps) => {
  const { t } = useTranslation('modals')
  const { openModal } = useOverlay().modal
  const { connectExtension } = useExtensionAccounts()
  const { extensionsStatus, extensionCanConnect, extensionInstalled } =
    useExtensions()

  const { id, title, website } = extension

  const isInstalled = extensionInstalled(id)
  const canConnect = extensionCanConnect(id)
  const connected = extensionsStatus[id] === 'connected'

  // Get the correct icon id for the extension.
  const iconId =
    window?.walletExtension?.isNovaWallet && id === 'polkadot-js'
      ? 'nova-wallet'
      : id
  const Icon = ExtensionIcons[iconId]
  const disabled = !isInstalled

  // Handle connect and disconnect from extension.
  const handleClick = async () => {
    if (!connected) {
      if (canConnect) {
        await connectExtension(id)
        setOpen(false)
        openModal({ key: 'Accounts' })
      } else {
        alert('Unable to connect to the extension.')
      }
    } else {
      if (confirm(t('disconnectFromExtension'))) {
        const updatedAtiveExtensions = (
          localStorageOrDefault('active_extensions', [], true) as string[]
        ).filter((ext: string) => ext !== id)

        localStorage.setItem(
          'active_extensions',
          JSON.stringify(updatedAtiveExtensions)
        )
        location.reload()
      }
    }
  }

  // Determine icon to be displayed based on extension status
  let faIcon: IconDefinition
  switch (extensionsStatus[id]) {
    case 'not_authenticated':
      faIcon = faPlugCircleExclamation
      break
    default:
      faIcon = faPlus
  }

  return (
    <ConnectItem.Item last={last}>
      <div>
        <ConnectItem.Logo Svg={Icon} />
      </div>
      <div>
        <div>
          <h3 className={`${connected ? ` connected` : ``}`}>{title}</h3>
          <ConnectItem.WebUrl url={`https://${website}`} text={website} />
        </div>
        <div>
          <ButtonMonoInvert
            style={
              connected ? { color: 'var(--status-danger-color)' } : undefined
            }
            text={
              connected
                ? t('disconnect', { ns: 'modals' })
                : isInstalled
                  ? t('connect', { ns: 'modals' })
                  : t('notInstalled', { ns: 'modals' })
            }
            onClick={() => handleClick()}
            iconRight={
              connected ? undefined : isInstalled ? faIcon : faPlugCircleXmark
            }
            disabled={disabled}
          />
        </div>
      </div>
    </ConnectItem.Item>
  )
}
