// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useBalances } from 'contexts/Balances'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useProxies } from 'contexts/Proxies'
import { useTransferOptions } from 'contexts/TransferOptions'
import { useActiveBalances } from 'hooks/useActiveBalances'
import { ActionItem } from 'library/ActionItem'
import { Fragment, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import type { MaybeAddress } from 'types'
import { CustomHeader, Padding } from 'ui-core/modal'
import { Close, useOverlay } from 'ui-overlay'
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
  const { getDelegates } = useProxies()
  const { accounts } = useImportedAccounts()
  const { activeAddress } = useActiveAccounts()
  const { getFeeReserve } = useTransferOptions()
  const { getAccountBalance, getEdReserved } = useBalances()
  const { status: modalStatus, setModalResize } = useOverlay().modal

  // Listen to balance updates for entire accounts list
  const { getPoolMembership } = useActiveBalances({
    accounts: accounts.map(({ address }) => address),
  })

  // Calculate transferrable balance of an address
  const getTransferrableBalance = (address: MaybeAddress) => {
    // Get fee reserve from local storage
    const feeReserve = getFeeReserve(address)
    // Get amount required for existential deposit
    const edReserved = getEdReserved(address)
    // Gets actual balance numbers
    const {
      balance: { free, frozen },
    } = getAccountBalance(address)

    // Minus reserves and frozen balance from free to get transferrable
    return BigNumber.max(
      new BigNumber(free).minus(edReserved).minus(feeReserve).minus(frozen),
      0
    )
  }

  const stashes: string[] = []
  // accumulate imported stash accounts
  for (const { address } of accounts) {
    const { locks } = getAccountBalance(address)

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

  for (const { address, source } of accounts) {
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
      notStaking.push({ address, source, delegates })
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
        source,
        stashImported: true,
        delegates,
      })
      continue
    }

    // Nominating only.
    if (isNominating && !isInPool) {
      nominating.push({ address, source, stashImported: true, delegates })
      continue
    }

    // In pool only.
    if (!isNominating && isInPool && poolMember) {
      inPool.push({ ...poolMember, source, delegates })
    }
  }

  // Resize if modal open upon state changes.
  useEffect(() => {
    if (modalStatus === 'open') {
      setModalResize()
    }
  }, [
    accounts,
    activeAddress,
    JSON.stringify(nominating),
    JSON.stringify(inPool.map((p) => p.address)),
    JSON.stringify(nominatingAndPool.map((p) => p.address)),
    JSON.stringify(notStaking),
  ])

  return (
    <>
      <Close />
      <Padding>
        <CustomHeader>
          <div>
            <h1>{t('accounts')}</h1>
          </div>
        </CustomHeader>
        {!activeAddress && !accounts.length && (
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
            {nominatingAndPool.map(({ address, source, delegates }, i) => (
              <Fragment key={`acc_nominating_and_pool_${i}`}>
                <AccountButton
                  transferrableBalance={getTransferrableBalance(address)}
                  address={address}
                  source={source}
                />
                {address && (
                  <Delegates
                    delegator={address}
                    source={source}
                    delegates={delegates}
                  />
                )}
              </Fragment>
            ))}
          </>
        ) : null}

        {nominating.length ? (
          <>
            <AccountSeparator />
            <ActionItem text={t('nominating')} />
            {nominating.map(({ address, source, delegates }, i) => (
              <Fragment key={`acc_nominating_${i}`}>
                <AccountButton
                  transferrableBalance={getTransferrableBalance(address)}
                  address={address}
                  source={source}
                />
                {address && (
                  <Delegates
                    delegator={address}
                    source={source}
                    delegates={delegates}
                  />
                )}
              </Fragment>
            ))}
          </>
        ) : null}

        {inPool.length ? (
          <>
            <AccountSeparator />
            <ActionItem text={t('inPool')} />
            {inPool.map(({ address, source, delegates }, i) => (
              <Fragment key={`acc_in_pool_${i}`}>
                <AccountButton
                  transferrableBalance={getTransferrableBalance(address)}
                  address={address}
                  source={source}
                />
                {address && (
                  <Delegates
                    delegator={address}
                    source={source}
                    delegates={delegates}
                  />
                )}
              </Fragment>
            ))}
          </>
        ) : null}

        {notStaking.length ? (
          <>
            <AccountSeparator />
            <ActionItem text={t('notStaking')} />
            {notStaking.map(({ address, source, delegates }, i) => (
              <Fragment key={`acc_not_staking_${i}`}>
                <AccountButton
                  transferrableBalance={getTransferrableBalance(address)}
                  address={address}
                  source={source}
                />
                {address && (
                  <Delegates
                    delegator={address}
                    source={source}
                    delegates={delegates}
                  />
                )}
              </Fragment>
            ))}
          </>
        ) : null}
      </Padding>
    </>
  )
}
