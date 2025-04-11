// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faFlag } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getNetworkData } from 'consts/util'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { useSyncing } from 'hooks/useSyncing'
import { useTranslation } from 'react-i18next'
import { planckToUnitBn } from 'utils'
import type { NominateStatusBarProps } from '../types'
import { Wrapper } from './Wrapper'

export const CreatePoolStatusBar = ({ value }: NominateStatusBarProps) => {
  const { t } = useTranslation('app')
  const { minCreateBond } = useApi().poolsConfig
  const { network } = useNetwork()
  const { syncing } = useSyncing(['initialization'])
  const { unit, units } = getNetworkData(network)

  const minCreateBondUnit = planckToUnitBn(minCreateBond, units)
  const sectionClassName =
    value.isGreaterThanOrEqualTo(minCreateBondUnit) && !syncing ? 'invert' : ''

  return (
    <Wrapper>
      <div className="bars">
        <section className={sectionClassName}>
          <h4>&nbsp;</h4>
          <div className="bar">
            <h5>0 {unit}</h5>
          </div>
        </section>
        <section className={sectionClassName}>
          <h4>
            <FontAwesomeIcon icon={faFlag} transform="shrink-4" />
            &nbsp;{t('createPool')}
          </h4>
          <div className="bar">
            <h5>
              {syncing
                ? '...'
                : `${minCreateBondUnit.decimalPlaces(3).toFormat()} ${unit}`}
            </h5>
          </div>
        </section>
      </div>
    </Wrapper>
  )
}
