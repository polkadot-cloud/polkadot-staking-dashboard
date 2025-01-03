// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  faExternalLinkAlt,
  faMinus,
  faPlus,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ExtensionIcons } from '@w3ux/extension-assets/util'
import { useExtensionAccounts, useExtensions } from '@w3ux/react-connect-kit'
import { localStorageOrDefault } from '@w3ux/utils'
import { Notifications } from 'controllers/Notifications'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ModalConnectItem } from 'ui-overlay/structure'
import { ExtensionInner } from './Wrappers'
import type { ExtensionProps } from './types'

export const Extension = ({ meta, size, flag }: ExtensionProps) => {
  const { t } = useTranslation('modals')
  const { connectExtensionAccounts } = useExtensionAccounts()
  const { extensionsStatus, extensionInstalled, extensionCanConnect } =
    useExtensions()
  const { title, website, id } = meta
  const isInstalled = extensionInstalled(id)
  const canConnect = extensionCanConnect(id)

  // Force re-render on click.
  const [increment, setIncrement] = useState<number>(0)

  const connected = extensionsStatus[id] === 'connected'

  // Click to connect to extension.
  const handleClick = async () => {
    if (!connected) {
      if (canConnect) {
        const success = await connectExtensionAccounts(id)
        // force re-render to display error messages
        setIncrement(increment + 1)

        if (success) {
          Notifications.emit({
            title: t('extensionConnected'),
            subtitle: `${t('titleExtensionConnected', { title })}`,
          })
        }
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

  // Get the correct icon id for the extension.
  const iconId =
    window?.walletExtension?.isNovaWallet && id === 'polkadot-js'
      ? 'nova-wallet'
      : id
  const Icon = ExtensionIcons[iconId]

  // Determine message to be displayed based on extension status.
  let statusJsx
  switch (extensionsStatus[id]) {
    case 'connected':
      statusJsx = (
        <p className="active">
          <FontAwesomeIcon icon={faMinus} className="plus" />
          {t('disconnect')}
        </p>
      )
      break

    case 'not_authenticated':
      statusJsx = <p>{t('notAuthenticated')}</p>
      break

    default:
      statusJsx = (
        <p className="active">
          <FontAwesomeIcon icon={faPlus} className="plus" />
          {t('connect')}
        </p>
      )
  }

  const websiteText = typeof website === 'string' ? website : website.text
  const websiteUrl = typeof website === 'string' ? website : website.url
  const disabled = !isInstalled

  return (
    <ModalConnectItem canConnect={canConnect}>
      <ExtensionInner>
        <div>
          <div className="body">
            {!disabled ? (
              <button
                type="button"
                className="button"
                onClick={() => handleClick()}
              >
                &nbsp;
              </button>
            ) : null}

            <div className="row icon">
              {Icon && <Icon style={{ width: size, height: size }} />}
            </div>
            <div className="status">
              {flag && flag}
              {isInstalled ? statusJsx : <p>{t('notInstalled')}</p>}
            </div>
            <div className="row">
              <h3>{title}</h3>
              {connected && <p className="active inline">{t('connected')}</p>}
            </div>
          </div>
          <div className="foot">
            <a
              className="link"
              href={`https://${websiteUrl}`}
              target="_blank"
              rel="noreferrer"
            >
              {websiteText}
              <FontAwesomeIcon icon={faExternalLinkAlt} transform="shrink-6" />
            </a>
          </div>
        </div>
      </ExtensionInner>
    </ModalConnectItem>
  )
}
