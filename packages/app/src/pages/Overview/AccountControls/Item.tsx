// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCopy } from '@fortawesome/free-regular-svg-icons'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Polkicon } from '@w3ux/react-polkicon'
import { ellipsisFn } from '@w3ux/utils'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useProxies } from 'contexts/Proxies'
import { Notifications } from 'controllers/Notifications'
import type { NotificationText } from 'controllers/Notifications/types'
import { useTranslation } from 'react-i18next'
import { ItemWrapper } from './Wrappers'
import type { ActiveAccountProps } from './types'

export const Item = ({ address, delegate = null }: ActiveAccountProps) => {
  const { t } = useTranslation('pages')
  const { getProxyDelegate } = useProxies()
  const { getAccount } = useImportedAccounts()

  const primaryAddress = delegate || address || ''
  const delegatorAddress = delegate ? address : null

  const accountData = getAccount(primaryAddress)

  // click to copy notification
  let notification: NotificationText | null = null
  if (accountData !== null) {
    notification = {
      title: t('overview.addressCopied'),
      subtitle: accountData.address,
    }
  }

  const proxyDelegate = getProxyDelegate(delegatorAddress, primaryAddress)

  return (
    <ItemWrapper>
      <div className="title">
        <h4>
          {accountData && (
            <>
              {delegatorAddress && (
                <div className="delegator">
                  <div>
                    <Polkicon address={delegatorAddress || ''} />
                  </div>
                </div>
              )}
              <div className="icon">
                <Polkicon address={primaryAddress} />
              </div>
              {delegatorAddress && (
                <span>
                  {proxyDelegate?.proxyType} {t('overview.proxy')}
                  <FontAwesomeIcon icon={faArrowLeft} transform="shrink-2" />
                </span>
              )}
              {ellipsisFn(primaryAddress)}
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(primaryAddress)
                  if (notification) {
                    Notifications.emit(notification)
                  }
                }}
              >
                <FontAwesomeIcon
                  className="copy"
                  icon={faCopy}
                  transform="shrink-4"
                />
              </button>
              {accountData.name !== ellipsisFn(primaryAddress) && (
                <>
                  <div className="sep" />
                  <div className="rest">
                    <span className="name">{accountData.name}</span>
                  </div>
                </>
              )}
            </>
          )}

          {!accountData ? t('overview.noActiveAccount') : null}
        </h4>
      </div>
    </ItemWrapper>
  )
}
