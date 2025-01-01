// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/types'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useFastUnstake } from 'contexts/FastUnstake'
import { useStaking } from 'contexts/Staking'
import { useTransferOptions } from 'contexts/TransferOptions'
import { useTranslation } from 'react-i18next'
import { useNominationStatus } from '../useNominationStatus'

export const useUnstaking = () => {
  const { t } = useTranslation('library')
  const { inSetup } = useStaking()
  const { activeAccount } = useActiveAccounts()
  const { getTransferOptions } = useTransferOptions()
  const { getNominationStatus } = useNominationStatus()
  const { checking, head, isExposed, queueDeposit, lastExposed } =
    useFastUnstake()
  const transferOptions = getTransferOptions(activeAccount).nominate
  const { nominees } = getNominationStatus(activeAccount, 'nominator')

  // determine if user is regular unstaking
  const { active } = transferOptions

  // determine if user is fast unstaking.
  const inHead =
    head?.stashes.find((s: AnyJson) => s[0] === activeAccount) ?? undefined
  const inQueue = queueDeposit?.deposit?.isGreaterThan(0) ?? false

  const registered = inHead || inQueue

  // determine unstake button
  const getFastUnstakeText = () => {
    if (checking) {
      return `${t('fastUnstakeCheckingEras')}...`
    }
    if (isExposed && lastExposed) {
      return t('fastUnstakeExposed', {
        count: Number(lastExposed),
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
