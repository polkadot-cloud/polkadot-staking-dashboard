// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faFlag } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { planckToUnit } from '@w3ux/utils'
import BigNumber from 'bignumber.js'
import { getNetworkData } from 'consts/util'
import { useApi } from 'contexts/Api'
import { useHelp } from 'contexts/Help'
import { useNetwork } from 'contexts/Network'
import { useSyncing } from 'hooks/useSyncing'
import { useTranslation } from 'react-i18next'
import { ButtonHelp } from 'ui-buttons'
import type { NominateStatusBarProps } from '../types'
import { Wrapper } from './Wrapper'

export const NominateStatusBar = ({ value }: NominateStatusBarProps) => {
  const { t } = useTranslation('app')
  const { openHelp } = useHelp()
  const {
    stakingMetrics: { minNominatorBond, minimumActiveStake },
  } = useApi()
  const { network } = useNetwork()
  const { syncing } = useSyncing(['initialization'])
  const { unit, units } = getNetworkData(network)

  const minNominatorBondUnit = new BigNumber(
    planckToUnit(minNominatorBond, units)
  )
  const minimumActiveStakeUnit = new BigNumber(
    planckToUnit(minimumActiveStake, units)
  )
  const gtMinNominatorBond = value.isGreaterThanOrEqualTo(minNominatorBondUnit)
  const gtMinActiveStake = value.isGreaterThanOrEqualTo(minimumActiveStakeUnit)

  return (
    <Wrapper>
      <div className="bars">
        <section className={gtMinNominatorBond && !syncing ? 'invert' : ''}>
          <h4>&nbsp;</h4>
          <div className="bar">
            <h5>{t('nominateInactive')}</h5>
          </div>
        </section>
        <section className={gtMinNominatorBond && !syncing ? 'invert' : ''}>
          <h4>
            <FontAwesomeIcon icon={faFlag} transform="shrink-4" />
            &nbsp; {t('nominate')}
            <ButtonHelp marginLeft onClick={() => openHelp('Nominating')} />
          </h4>
          <div className="bar">
            <h5>
              {minNominatorBondUnit.decimalPlaces(3).toFormat()} {unit}
            </h5>
          </div>
        </section>
        <section className={gtMinActiveStake && !syncing ? 'invert' : ''}>
          <h4>
            <FontAwesomeIcon icon={faFlag} transform="shrink-4" />
            &nbsp;{t('nominateActive')}
            <ButtonHelp
              marginLeft
              onClick={() => openHelp('Active Stake Threshold')}
            />
          </h4>
          <div className="bar">
            <h5>
              {syncing
                ? '...'
                : `${(minimumActiveStakeUnit.isLessThan(minNominatorBondUnit)
                    ? minNominatorBondUnit
                    : minimumActiveStakeUnit
                  )
                    .decimalPlaces(3)
                    .toFormat()} ${unit}`}
            </h5>
          </div>
        </section>
      </div>
    </Wrapper>
  )
}
