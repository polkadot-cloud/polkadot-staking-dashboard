// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useFastUnstake } from 'contexts/FastUnstake'
import { useStaking } from 'contexts/Staking'
import { useTransferOptions } from 'contexts/TransferOptions'
import { useTranslation } from 'react-i18next'
import type { AnyJson } from 'types'
import { useNominationStatus } from '../useNominationStatus'

export const useUnstaking = () => {
  const { t } = useTranslation('app')
  const { inSetup } = useStaking()
  const { activeAddress } = useActiveAccounts()
  const { getTransferOptions } = useTransferOptions()
  const { getNominationStatus } = useNominationStatus()
  const { head, queueDeposit, fastUnstakeStatus, exposed } = useFastUnstake()

  const transferOptions = getTransferOptions(activeAddress).nominate
  const { nominees } = getNominationStatus(activeAddress, 'nominator')

  // determine if user is regular unstaking
  const { active } = transferOptions

  // determine if user is fast unstaking.
  const inHead =
    head?.stashes.find((s: AnyJson) => s[0] === activeAddress) ?? undefined
  const inQueue = queueDeposit?.queue !== undefined && queueDeposit.queue > 0n

  const registered = inHead || inQueue

  // determine unstake button
  const getFastUnstakeText = () => {
    if (exposed && fastUnstakeStatus?.lastExposed) {
      return t('fastUnstakeExposed', {
        count: Number(fastUnstakeStatus.lastExposed),
      })
    }
    if (registered) {
      return t('inQueue')
    }
    return t('fastUnstake')
  }

  return {
    getFastUnstakeText,
    isUnstaking: !inSetup() && !nominees.active.length && active.isZero(),
    isFastUnstaking: !!registered,
  }
}
