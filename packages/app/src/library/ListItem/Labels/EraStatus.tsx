// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { capitalizeFirstLetter } from '@w3ux/utils'
import BigNumber from 'bignumber.js'
import { getNetworkData } from 'consts/util'
import { useNetwork } from 'contexts/Network'
import { useValidators } from 'contexts/Validators/ValidatorEntries'
import { useSyncing } from 'hooks/useSyncing'
import { ValidatorStatusWrapper } from 'library/ListItem/Wrappers'
import { useTranslation } from 'react-i18next'
import { planckToUnitBn } from 'utils'
import type { EraStatusProps } from '../types'

export const EraStatus = ({ address, noMargin, status }: EraStatusProps) => {
  const { t } = useTranslation('app')
  const { syncing } = useSyncing()
  const { network } = useNetwork()
  const { getValidatorTotalStake } = useValidators()
  const { unit, units } = getNetworkData(network)

  // Fallback to `waiting` status if still syncing.
  const validatorStatus = syncing ? 'waiting' : status

  return (
    <ValidatorStatusWrapper $status={validatorStatus} $noMargin={noMargin}>
      <h5>
        {syncing
          ? t('syncing')
          : validatorStatus !== 'waiting'
            ? `${t('listItemActive')} / ${planckToUnitBn(
                new BigNumber(getValidatorTotalStake(address).toString()),
                units
              )
                .integerValue()
                .toFormat()} ${unit}`
            : capitalizeFirstLetter(t(`${validatorStatus}`) ?? '')}
      </h5>
    </ValidatorStatusWrapper>
  )
}
