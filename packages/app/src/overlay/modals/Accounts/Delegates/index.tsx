// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { isSupportedProxy } from 'consts/util'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import type { ProxyDelegateWithBalance } from 'contexts/Proxies/types'
import { AccountButton } from '../Account'
import type { DelegatesProps } from '../types'
import { DelegatesWrapper } from './Wrapper'

export const Delegates = ({ delegates, source, delegator }: DelegatesProps) => {
  const { accounts } = useImportedAccounts()
  const { getAccount } = useImportedAccounts()

  // Filter delegates that are external or not imported. Default to empty array if there are no
  // delegates for this address.
  const delegatesList = (delegates?.delegates.filter(
    ({ delegate, proxyType }) =>
      accounts.find(({ address }) => address === delegate) !== undefined &&
      isSupportedProxy(proxyType) &&
      getAccount(delegate || null)?.source !== 'external'
  ) || []) as ProxyDelegateWithBalance[]

  return delegatesList.length ? (
    <DelegatesWrapper>
      {delegatesList.map(({ delegate, proxyType, transferrableBalance }, i) => (
        <AccountButton
          transferrableBalance={transferrableBalance}
          key={`_del_${i}`}
          address={delegate}
          source={source}
          delegator={delegator}
          proxyType={proxyType}
        />
      ))}
    </DelegatesWrapper>
  ) : null
}
