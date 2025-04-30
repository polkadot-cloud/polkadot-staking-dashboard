// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { createPoolAccounts as createUtil } from 'utils'

export const useCreatePoolAccounts = () => {
  const { network } = useNetwork()
  const { getChainSpec, getConsts } = useApi()
  const { poolsPalletId } = getConsts(network)
  const { ss58Format } = getChainSpec(network).properties

  const createPoolAccounts = (poolId: number) =>
    createUtil(poolId, poolsPalletId, ss58Format)

  return createPoolAccounts
}
