// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faGlasses } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import LedgerSVG from '@w3ux/extension-assets/LedgerSquare.svg?react'
import PolkadotVaultSVG from '@w3ux/extension-assets/PolkadotVault.svg?react'
import WalletConnectSVG from '@w3ux/extension-assets/WalletConnect.svg?react'
import { ExtensionIcons } from '@w3ux/extension-assets/util'
import { Polkicon } from '@w3ux/react-polkicon'
import { ellipsisFn, planckToUnit } from '@w3ux/utils'
import { getNetworkData } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useNetwork } from 'contexts/Network'
import { useTranslation } from 'react-i18next'
import { useOverlay } from 'ui-overlay'
import { AccountWrapper } from './Wrappers'
import type { AccountItemProps } from './types'

export const AccountButton = ({
  label,
  address,
  source,
  delegator,
  proxyType,
  noBorder = false,
  transferrableBalance,
}: AccountItemProps) => {
  const { t } = useTranslation('modals')
  const { getAccount } = useImportedAccounts()
  const {
    activeProxy,
    activeAddress,
    setActiveAccount,
    setActiveProxy,
    activeProxyType,
  } = useActiveAccounts()
  const { network } = useNetwork()
  const { setModalStatus } = useOverlay().modal
  const { unit, units } = getNetworkData(network)

  // Accumulate account data.
  const meta = getAccount(address || '')

  const imported = !!meta
  const connectTo = delegator || address || ''
  const connectProxy = delegator ? address || null : ''

  // Determine account source icon.
  const Icon =
    meta?.source === 'ledger'
      ? LedgerSVG
      : meta?.source === 'vault'
        ? PolkadotVaultSVG
        : meta?.source === 'wallet_connect'
          ? WalletConnectSVG
          : ExtensionIcons[meta?.source || ''] || undefined

  // Determine if this account is active (active account or proxy).
  const isActive =
    (connectTo === activeAddress &&
      address === activeAddress &&
      !activeProxy) ||
    (connectProxy === activeProxy?.address &&
      proxyType === activeProxyType &&
      activeProxy.address)

  // Handle account click. Handles both active account and active proxy.
  const handleClick = () => {
    if (!imported) {
      return
    }
    const account = getAccount(connectTo)
    setActiveAccount(
      account ? { address: account.address, source: account.source } : null
    )
    setActiveProxy(
      proxyType && connectProxy
        ? { address: connectProxy, source, proxyType }
        : null
    )
    setModalStatus('closing')
  }

  return (
    <AccountWrapper className={isActive ? 'active' : undefined}>
      <div className={noBorder ? 'noBorder' : undefined}>
        <section className="head">
          <button
            type="button"
            onClick={() => handleClick()}
            disabled={!imported}
          >
            {delegator && (
              <div className="delegator" style={{ maxWidth: '1.9rem' }}>
                <div>
                  <Polkicon address={delegator} fontSize="1.9rem" />
                </div>
              </div>
            )}
            <div className="identicon" style={{ maxWidth: '1.9rem' }}>
              <Polkicon address={address ?? ''} fontSize="1.9rem" />
            </div>
            <span className="name">
              {delegator && (
                <span>
                  {proxyType} {t('proxy')}
                </span>
              )}
              {meta?.name ?? ellipsisFn(address ?? '')}
            </span>
            {meta?.source === 'external' && (
              <div
                className="label warning"
                style={{ color: '#a17703', paddingLeft: '0.5rem' }}
              >
                {t('readOnly')}
              </div>
            )}
            <div className={label === undefined ? `` : label[0]}>
              {label !== undefined ? <h5>{label[1]}</h5> : null}
              {Icon !== undefined ? (
                <span className="icon">
                  <Icon />
                </span>
              ) : null}

              {meta?.source === 'external' && (
                <FontAwesomeIcon
                  icon={faGlasses}
                  className="icon"
                  style={{ opacity: 0.7 }}
                />
              )}
            </div>
          </button>
        </section>
        <section className="foot">
          <span className="balance">
            {`${t('free')}: ${new BigNumber(
              planckToUnit(transferrableBalance || 0n, units)
            )
              .decimalPlaces(3)
              .toFormat()} ${unit}`}
          </span>
        </section>
      </div>
    </AccountWrapper>
  )
}
