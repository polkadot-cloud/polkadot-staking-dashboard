// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { PoolBondExtra } from 'api/tx/poolBondExtra'
import { StakingBondExtra } from 'api/tx/stakingBondExtra'
import BigNumber from 'bignumber.js'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { useTransferOptions } from 'contexts/TransferOptions'
import { useEffect, useMemo, useState } from 'react'
import type { BondFor } from 'types'

export const useBondGreatestFee = ({ bondFor }: { bondFor: BondFor }) => {
  const { network } = useNetwork()
  const { activeAddress } = useActiveAccounts()
  const { feeReserve, getTransferOptions } = useTransferOptions()
  const { isReady } = useApi()
  const transferOptions = useMemo(
    () => getTransferOptions(activeAddress),
    [activeAddress]
  )
  const { transferrableBalance } = transferOptions

  // store the largest possible tx fees for bonding.
  const [largestTxFee, setLargestTxFee] = useState<BigNumber>(new BigNumber(0))

  // update max tx fee on free balance change
  useEffect(() => {
    if (isReady) {
      handleFetch()
    }
  }, [transferOptions, isReady])

  // handle fee fetching
  const handleFetch = async () => {
    const largestFee = await txLargestFee()
    setLargestTxFee(largestFee)
  }

  // estimate the largest possible tx fee based on users free balance.
  const txLargestFee = async () => {
    if (!isReady) {
      return new BigNumber(0)
    }

    const bond = BigNumber.max(
      transferrableBalance.minus(feeReserve),
      0
    ).toString()

    let tx = null
    if (bondFor === 'pool') {
      tx = new PoolBondExtra(network, 'FreeBalance', BigInt(bond)).tx()
    } else if (bondFor === 'nominator') {
      tx = new StakingBondExtra(network, BigInt(bond)).tx()
    }

    if (tx && activeAddress) {
      const partial_fee =
        (await tx?.getPaymentInfo(activeAddress))?.partial_fee || 0n

      return new BigNumber(partial_fee)
    }
    return new BigNumber(0)
  }

  return largestTxFee
}
