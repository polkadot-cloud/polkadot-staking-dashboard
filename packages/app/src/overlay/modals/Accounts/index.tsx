// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faChevronLeft, faLinkSlash } from '@fortawesome/free-solid-svg-icons'
import BigNumber from 'bignumber.js'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useProxies } from 'contexts/Proxies'
import { useTransferOptions } from 'contexts/TransferOptions'
import { useActiveBalances } from 'hooks/useActiveBalances'
import { ActionItem } from 'library/ActionItem'
import { Fragment, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import type { MaybeAddress } from 'types'
import { ButtonPrimaryInvert, ButtonText } from 'ui-buttons'
import { useOverlay } from 'ui-overlay'
import { ModalCustomHeader, ModalPadding } from 'ui-overlay/structure'
import { AccountButton } from './Account'
import { Delegates } from './Delegates'
import { AccountSeparator, AccountWrapper } from './Wrappers'
import type {
  AccountInPool,
  AccountNominating,
  AccountNominatingAndInPool,
  AccountNotStaking,
} from './types'

export const Accounts = () => {
  const { t } = useTranslation('modals')
  const {
    consts: { existentialDeposit },
  } = useApi()
  const { getDelegates } = useProxies()
  const {
    replaceModal,
    status: modalStatus,
    setModalResize,
  } = useOverlay().modal
  const { accounts } = useImportedAccounts()
  const { getFeeReserve } = useTransferOptions()
  const { activeAccount, setActiveAccount, setActiveProxy } =
    useActiveAccounts()

  // Listen to balance updates for entire accounts list.
  const { getLocks, getBalance, getEdReserved, getPoolMembership } =
    useActiveBalances({
      accounts: accounts.map(({ address }) => address),
    })

  // Calculate transferrable balance of an address.
  const getTransferrableBalance = (address: MaybeAddress) => {
    // Get fee reserve from local storage.
    const feeReserve = getFeeReserve(address)
    // Get amount required for existential deposit.
    const edReserved = getEdReserved(address, existentialDeposit)
    // Gets actual balance numbers.
    const { free, frozen } = getBalance(address)
    // Minus reserves and frozen balance from free to get transferrable.
    return BigNumber.max(
      free.minus(edReserved).minus(feeReserve).minus(frozen),
      0
    )
  }

  const stashes: string[] = []
  // accumulate imported stash accounts
  for (const { address } of accounts) {
    const { locks } = getLocks(address)

    // account is a stash if they have an active `staking` lock
    if (locks.find(({ id }) => id === 'staking')) {
      stashes.push(address)
    }
  }

  // construct account groupings
  const nominating: AccountNominating[] = []
  const inPool: AccountInPool[] = []
  const nominatingAndPool: AccountNominatingAndInPool[] = []
  const notStaking: AccountNotStaking[] = []

  for (const { address } of accounts) {
    let isNominating = false
    let isInPool = false
    const isStash = stashes[stashes.indexOf(address)] ?? null
    const delegates = getDelegates(address)

    // Inject transferrable balance into delegates list.
    if (delegates?.delegates) {
      delegates.delegates = delegates?.delegates.map((d) => ({
        ...d,
        transferrableBalance: getTransferrableBalance(d.delegate),
      }))
    }

    const poolMember = getPoolMembership(address)

    // Check if nominating.
    if (
      isStash &&
      nominating.find((a) => a.address === address) === undefined
    ) {
      isNominating = true
    }

    // Check if in pool.
    if (poolMember) {
      if (!inPool.find((n) => n.address === address)) {
        isInPool = true
      }
    }

    // If not doing anything, add address to `notStaking`.
    if (
      !isStash &&
      !poolMember &&
      !notStaking.find((n) => n.address === address)
    ) {
      notStaking.push({ address, delegates })
      continue
    }

    // If both nominating and in pool, add to this list.
    if (
      isNominating &&
      isInPool &&
      poolMember &&
      !nominatingAndPool.find((n) => n.address === address)
    ) {
      nominatingAndPool.push({
        ...poolMember,
        address,
        stashImported: true,
        delegates,
      })
      continue
    }

    // Nominating only.
    if (isNominating && !isInPool) {
      nominating.push({ address, stashImported: true, delegates })
      continue
    }

    // In pool only.
    if (!isNominating && isInPool && poolMember) {
      inPool.push({ ...poolMember, delegates })
    }
  }

  // Resize if modal open upon state changes.
  useEffect(() => {
    if (modalStatus === 'open') {
      setModalResize()
    }
  }, [
    accounts,
    activeAccount,
    JSON.stringify(nominating),
    JSON.stringify(inPool),
    JSON.stringify(nominatingAndPool),
    JSON.stringify(notStaking),
  ])

  return (
    <ModalPadding>
      <ModalCustomHeader>
        <div>
          <h1>{t('accounts')}</h1>
          <ButtonPrimaryInvert
            text={t('goToConnect')}
            iconLeft={faChevronLeft}
            iconTransform="shrink-3"
            onClick={() =>
              replaceModal({ key: 'Connect', options: { disableScroll: true } })
            }
            marginLeft
          />
        </div>
        <div>
          {activeAccount && (
            <ButtonText
              style={{
                color: 'var(--accent-color-primary)',
              }}
              text={t('disconnect')}
              iconRight={faLinkSlash}
              onClick={() => {
                setActiveAccount(null)
                setActiveProxy(null)
              }}
            />
          )}
        </div>
      </ModalCustomHeader>
      {!activeAccount && !accounts.length && (
        <AccountWrapper style={{ marginTop: '1.5rem' }}>
          <div>
            <div>
              <h4 style={{ padding: '0.75rem 1rem' }}>
                {t('noActiveAccount')}
              </h4>
            </div>
            <div />
          </div>
        </AccountWrapper>
      )}

      {nominatingAndPool.length ? (
        <>
          <AccountSeparator />
          <ActionItem text={t('nominatingAndInPool')} />
          {nominatingAndPool.map(({ address, delegates }, i) => (
            <Fragment key={`acc_nominating_and_pool_${i}`}>
              <AccountButton
                transferrableBalance={getTransferrableBalance(address)}
                address={address}
              />
              {address && (
                <Delegates delegator={address} delegates={delegates} />
              )}
            </Fragment>
          ))}
        </>
      ) : null}

      {nominating.length ? (
        <>
          <AccountSeparator />
          <ActionItem text={t('nominating')} />
          {nominating.map(({ address, delegates }, i) => (
            <Fragment key={`acc_nominating_${i}`}>
              <AccountButton
                transferrableBalance={getTransferrableBalance(address)}
                address={address}
              />
              {address && (
                <Delegates delegator={address} delegates={delegates} />
              )}
            </Fragment>
          ))}
        </>
      ) : null}

      {inPool.length ? (
        <>
          <AccountSeparator />
          <ActionItem text={t('inPool')} />
          {inPool.map(({ address, delegates }, i) => (
            <Fragment key={`acc_in_pool_${i}`}>
              <AccountButton
                transferrableBalance={getTransferrableBalance(address)}
                address={address}
              />
              {address && (
                <Delegates delegator={address} delegates={delegates} />
              )}
            </Fragment>
          ))}
        </>
      ) : null}

      {notStaking.length ? (
        <>
          <AccountSeparator />
          <ActionItem text={t('notStaking')} />
          {notStaking.map(({ address, delegates }, i) => (
            <Fragment key={`acc_not_staking_${i}`}>
              <AccountButton
                transferrableBalance={getTransferrableBalance(address)}
                address={address}
              />
              {address && (
                <Delegates delegator={address} delegates={delegates} />
              )}
            </Fragment>
          ))}
        </>
      ) : null}
    </ModalPadding>
  )
}
