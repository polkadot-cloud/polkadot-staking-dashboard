// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useTransferOptions } from 'contexts/TransferOptions'
import type { SubmittableExtrinsic } from 'dedot'
import { useEffect, useMemo, useState } from 'react'
import type { BondFor } from 'types'

export const useBondGreatestFee = ({ bondFor }: { bondFor: BondFor }) => {
  const { serviceApi } = useApi()
  const { activeAddress } = useActiveAccounts()
  const { feeReserve, getTransferOptions } = useTransferOptions()
  const transferOptions = useMemo(
    () => getTransferOptions(activeAddress),
    [activeAddress]
  )
  const { transferrableBalance } = transferOptions

  // store the largest possible tx fees for bonding.
  const [largestTxFee, setLargestTxFee] = useState<BigNumber>(new BigNumber(0))

  // update max tx fee on free balance change
  useEffect(() => {
    handleFetch()
  }, [transferOptions])

  // handle fee fetching
  const handleFetch = async () => {
    const largestFee = await txLargestFee()
    setLargestTxFee(largestFee)
  }

  // estimate the largest possible tx fee based on users free balance.
  const txLargestFee = async () => {
    const bondBigInt = BigInt(
      BigNumber.max(transferrableBalance.minus(feeReserve), 0).toString()
    )

    let tx: SubmittableExtrinsic | undefined
    if (bondFor === 'pool') {
      tx = serviceApi.tx.poolBondExtra('FreeBalance', bondBigInt)
    } else if (bondFor === 'nominator') {
      tx = serviceApi.tx.stakingBondExtra(bondBigInt)
    }

    if (tx && activeAddress) {
      const partial_fee =
        (await tx?.paymentInfo(activeAddress))?.partialFee || 0n

      return new BigNumber(partial_fee)
    }
    return new BigNumber(0)
  }

  return largestTxFee
}
