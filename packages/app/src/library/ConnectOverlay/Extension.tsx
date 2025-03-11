// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { IconDefinition } from '@fortawesome/free-solid-svg-icons'
import {
  faCheckCircle,
  faPlugCircleExclamation,
  faPlugCircleXmark,
  faPlus,
} from '@fortawesome/free-solid-svg-icons'
import { ExtensionIcons } from '@w3ux/extension-assets/util'
import { useExtensionAccounts, useExtensions } from '@w3ux/react-connect-kit'
import { localStorageOrDefault } from '@w3ux/utils'
import { ConnectItem } from 'ui-core/popover'
import type { ExtensionProps } from './types'
import { ItemWrapper } from './Wrappers'

export const Extension = ({ extension, last }: ExtensionProps) => {
  const { connectExtensionAccounts } = useExtensionAccounts()
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

  const websiteText = typeof website === 'string' ? website : website.text
  const websiteUrl = typeof website === 'string' ? website : website.url
  const disabled = !isInstalled

  // Handle connect and disconnect from extension.
  const handleClick = async () => {
    if (!connected) {
      if (canConnect) {
        await connectExtensionAccounts(id)
      } else {
        alert('Console was unable to connect to the extension.')
      }
    } else {
      if (
        confirm(
          'Are you sure you want to disconnect from this extension? This will reload the console.'
        )
      ) {
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
    case 'connected':
      faIcon = faCheckCircle
      break
    case 'not_authenticated':
      faIcon = faPlugCircleExclamation
      break
    default:
      faIcon = faPlus
  }

  return (
    <ItemWrapper className={`${last ? ` last` : ``}`}>
      <div>
        <span className="icon">{Icon && <Icon />}</span>
      </div>
      <div>
        <div>
          <h3 className={`${connected ? ` connected` : ``}`}>{title}</h3>
          <ConnectItem.WebUrl
            url={`https://${websiteUrl}`}
            text={websiteText}
          />
        </div>
        <div>
          <ConnectItem.Button
            active={connected}
            onClick={() => handleClick()}
            faIcon={isInstalled ? faIcon : faPlugCircleXmark}
            disabled={disabled}
          />
        </div>
      </div>
    </ItemWrapper>
  )
}
