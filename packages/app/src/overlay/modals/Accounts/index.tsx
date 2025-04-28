// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useBalances } from 'contexts/Balances'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useProxies } from 'contexts/Proxies'
import { useTransferOptions } from 'contexts/TransferOptions'
import { ActionItem } from 'library/ActionItem'
import { Fragment, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
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
  const { getStakingLedger } = useBalances()
  const { activeAddress, activeProxy } = useActiveAccounts()
  const { getTransferOptions } = useTransferOptions()
  const { status: modalStatus, setModalResize } = useOverlay().modal

  // construct account groupings
  const nominating: AccountNominating[] = []
  const inPool: AccountInPool[] = []
  const nominatingAndPool: AccountNominatingAndInPool[] = []
  const notStaking: AccountNotStaking[] = []

  for (const { address, source } of accounts) {
    const { poolMembership, ledger } = getStakingLedger(address)

    let isNominating = false
    let isInPool = false
    const delegates = getDelegates(address)

    // Inject transferrable balance into delegates list.
    if (delegates?.delegates) {
      delegates.delegates = delegates?.delegates.map((d) => ({
        ...d,
        transferrableBalance: getTransferOptions(d.delegate)
          .transferrableBalance,
      }))
    }

    // Check if nominating
    if (
      !!ledger &&
      nominating.find((a) => a.address === address) === undefined
    ) {
      isNominating = true
    }

    // Check if in pool
    if (poolMembership) {
      if (!inPool.find((n) => n.address === address)) {
        isInPool = true
      }
    }

    // If not doing anything, add address to `notStaking`
    if (
      !isNominating &&
      !poolMembership &&
      !notStaking.find((n) => n.address === address)
    ) {
      notStaking.push({ address, source, delegates })
      continue
    }

    // If both nominating and in pool, add to this list.
    if (
      isNominating &&
      isInPool &&
      poolMembership &&
      !nominatingAndPool.find((n) => n.address === address)
    ) {
      nominatingAndPool.push({
        ...poolMembership,
        address,
        source,
        stashImported: true,
        delegates,
      })
      continue
    }

    // Nominating only
    if (isNominating && !isInPool) {
      nominating.push({ address, source, stashImported: true, delegates })
      continue
    }
    // In pool only
    if (!isNominating && isInPool && poolMembership) {
      inPool.push({ ...poolMembership, source, delegates })
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
    activeProxy,
    JSON.stringify(nominating.map((n) => n.address?.toString())),
    JSON.stringify(inPool.map((p) => p.address)),
    JSON.stringify(nominatingAndPool.map((p) => p.address)),
    JSON.stringify(notStaking.map((p) => p.address)),
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
                  transferrableBalance={
                    getTransferOptions(address).transferrableBalance
                  }
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
                  transferrableBalance={
                    getTransferOptions(address).transferrableBalance
                  }
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
                  transferrableBalance={
                    getTransferOptions(address).transferrableBalance
                  }
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
                  transferrableBalance={
                    getTransferOptions(address).transferrableBalance
                  }
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
