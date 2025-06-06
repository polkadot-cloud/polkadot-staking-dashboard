// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createSafeContext, useEffectIgnoreInitial } from '@w3ux/hooks'
import BigNumber from 'bignumber.js'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useExternalAccounts } from 'contexts/Connect/ExternalAccounts'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useOtherAccounts } from 'contexts/Connect/OtherAccounts'
import { useNetwork } from 'contexts/Network'
import {
  getLocalActiveProxy,
  proxies$,
  removeLocalActiveProxy,
  setActiveProxy,
} from 'global-bus'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import type { MaybeAddress, Proxies } from 'types'
import type {
  Delegates,
  ProxiesContextInterface,
  Proxy,
  ProxyDelegate,
} from './types'

export const [ProxiesContext, useProxies] =
  createSafeContext<ProxiesContextInterface>()

export const ProxiesProvider = ({ children }: { children: ReactNode }) => {
  const { network } = useNetwork()
  const { serviceApi } = useApi()
  const { addExternalAccount } = useExternalAccounts()
  const { addOrReplaceOtherAccount } = useOtherAccounts()
  const { activeProxy, activeAccount } = useActiveAccounts()
  const { accounts, stringifiedAccountsKey } = useImportedAccounts()

  // Store the proxy accounts of each imported account
  const [proxies, setProxies] = useState<Record<string, Proxies>>({})

  // Reformats proxies into a list of delegates
  const formatProxiesToDelegates = () => {
    // Reformat proxies into a list of delegates
    const newDelegates: Delegates = {}
    for (const [delegator, record] of Object.entries(proxies)) {
      // get each delegate of this proxy record
      for (const { delegate, proxyType } of record.proxies) {
        const item = {
          delegator,
          proxyType,
        }

        // check if this delegate exists in `newDelegates`
        if (Object.keys(newDelegates).includes(delegate)) {
          // append delegator to the existing delegate record if it exists
          newDelegates[delegate].push(item)
        } else {
          // create a new delegate record if it does not yet exist in `newDelegates`
          newDelegates[delegate] = [item]
        }
      }
    }
    return newDelegates
  }

  const delegates = formatProxiesToDelegates()

  // Gets the delegates of the given account
  const getDelegates = (address: MaybeAddress): Proxy | undefined => {
    const results = Object.entries(proxies).find(
      ([delegator]) => delegator === address
    )
    if (!results) {
      return undefined
    }
    const config = results[1]

    return {
      address,
      delegator: address,
      delegates: Object.values(config.proxies).map(
        ({ delegate, proxyType }) => ({
          delegate,
          proxyType,
        })
      ),
      reserved: new BigNumber(config.deposit),
    }
  }

  // Gets delegators and proxy types for the given delegate address
  // Queries the chain to check if the given delegator & delegate pair is valid proxy. Used when a
  // proxy account is being manually declared
  const handleDeclareDelegate = async (delegator: string) => {
    const results = await serviceApi.query.proxies(delegator)

    let addDelegatorAsExternal = false
    for (const delegate of results) {
      if (
        accounts.find(({ address }) => address === delegate) &&
        !delegates[delegate]
      ) {
        addDelegatorAsExternal = true
      }
    }
    if (addDelegatorAsExternal) {
      const importResult = addExternalAccount(delegator, 'system')
      if (importResult) {
        addOrReplaceOtherAccount(importResult.account, importResult.type)
      }
    }
    return []
  }

  // Gets the delegate and proxy type of an account, if any
  const getProxyDelegate = (
    delegator: MaybeAddress,
    delegate: MaybeAddress
  ): ProxyDelegate | null => {
    const results = Object.entries(proxies).find(([key]) => key === delegator)
    if (!results) {
      return null
    }
    const config = results[1]
    const maybeDelegate = Object.values(config.proxies).find(
      (d) => d.delegate === delegate
    )
    if (!maybeDelegate) {
      return null
    }
    return {
      delegate: maybeDelegate.delegate,
      proxyType: maybeDelegate.proxyType,
    }
  }

  // If active proxy has not yet been set, check local storage `activeProxy` & set it as active
  // proxy if it is the delegate of `activeAccount`
  //
  // NOTE: this ideally should be on the dedot api side, but better account abstraction is needed
  // prior to this migration, and adding external accounts + other account duplicate needs to be
  // resolved
  useEffectIgnoreInitial(() => {
    const localActiveProxy = getLocalActiveProxy(network)
    if (Object.keys(proxies).length && localActiveProxy && activeAccount) {
      try {
        const { address, source, proxyType } = localActiveProxy
        // Add proxy address as external account if not imported
        if (!accounts.find((a) => a.address === address)) {
          const importResult = addExternalAccount(address, 'system')
          if (importResult) {
            addOrReplaceOtherAccount(importResult.account, importResult.type)
          }
        }
        const isActive = (
          Object.entries(proxies).find(
            ([key]) => key === activeAccount.address
          )?.[1].proxies || []
        ).find((d) => d.delegate === address && d.proxyType === proxyType)

        if (isActive && !activeProxy) {
          setActiveProxy(network, { address, source, proxyType })
        }
      } catch (err) {
        removeLocalActiveProxy(network)
      }
    }
  }, [stringifiedAccountsKey, activeAccount, proxies, network])

  // Subscribe to global bus proxies
  useEffect(() => {
    const subProxies = proxies$.subscribe((result) => {
      setProxies(result)
    })
    return () => {
      subProxies.unsubscribe()
    }
  }, [])

  return (
    <ProxiesContext.Provider
      value={{
        handleDeclareDelegate,
        getDelegates,
        getProxyDelegate,
        formatProxiesToDelegates,
      }}
    >
      {children}
    </ProxiesContext.Provider>
  )
}
