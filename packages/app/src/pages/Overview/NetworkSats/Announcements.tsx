// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faBullhorn as faBack } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  capitalizeFirstLetter,
  planckToUnit,
  rmCommas,
  sortWithNull,
} from '@w3ux/utils'
import BigNumber from 'bignumber.js'
import { getNetworkData } from 'consts/util'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { useBondedPools } from 'contexts/Pools/BondedPools'
import { motion } from 'framer-motion'
import { Item } from 'library/Announcements/Wrappers'
import { Announcement as AnnouncementLoader } from 'library/Loader/Announcement'
import { useTranslation } from 'react-i18next'
import type { BondedPool } from 'types'
import { planckToUnitBn } from 'utils'

export const Announcements = () => {
  const { t } = useTranslation('pages')
  const { network } = useNetwork()
  const { bondedPools } = useBondedPools()
  const {
    poolsConfig: { counterForPoolMembers },
    stakingMetrics: { totalStaked, lastReward },
  } = useApi()

  const { unit, units } = getNetworkData(network)
  const lastRewardUnit = new BigNumber(planckToUnit(lastReward || 0, units))

  let totalPoolPoints = new BigNumber(0)
  bondedPools.forEach((b: BondedPool) => {
    totalPoolPoints = totalPoolPoints.plus(rmCommas(b.points))
  })
  const totalPoolPointsUnit = planckToUnitBn(totalPoolPoints, units)

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.25,
      },
    },
  }

  const listItem = {
    hidden: {
      opacity: 0,
    },
    show: {
      opacity: 1,
    },
  }

  const announcements = []

  // Total staked on the network
  if (totalStaked > 0n) {
    announcements.push({
      class: 'neutral',
      title: t('networkCurrentlyStaked', {
        total: new BigNumber(planckToUnit(totalStaked, units))
          .integerValue()
          .toFormat(),
        unit,
        network: capitalizeFirstLetter(network),
      }),
      subtitle: t('networkCurrentlyStakedSubtitle', {
        unit,
      }),
    })
  } else {
    announcements.push(null)
  }

  // Total locked in pools
  if (bondedPools.length) {
    announcements.push({
      class: 'neutral',
      title: `${totalPoolPointsUnit.integerValue().toFormat()} ${unit} ${t(
        'inPools'
      )}`,
      subtitle: `${t('bondedInPools', { networkUnit: unit })}`,
    })
  } else {
    announcements.push(null)
  }

  // Total locked in pools
  if (counterForPoolMembers > 0) {
    announcements.push({
      class: 'neutral',
      title: `${new BigNumber(counterForPoolMembers).toFormat()} ${t('poolMembersBonding')}`,
      subtitle: `${t('totalNumAccounts')}`,
    })
  } else {
    announcements.push(null)
  }

  // Last era payout
  if (lastRewardUnit.isGreaterThan(0)) {
    announcements.push({
      class: 'neutral',
      title: `${lastRewardUnit.integerValue().toFormat()} ${unit} ${t('paidOutLastEraTitle')}`,
      subtitle: `${t('paidOutLastEraSubtitle')}`,
    })
  } else {
    announcements.push(null)
  }

  announcements.sort(sortWithNull(true))

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      style={{ width: '100%' }}
    >
      {announcements.map((item, index) =>
        item === null ? (
          <AnnouncementLoader key={`announcement_${index}`} />
        ) : (
          <Item key={`announcement_${index}`} variants={listItem}>
            <h4 className={item.class}>
              <FontAwesomeIcon
                icon={faBack}
                style={{ marginRight: '0.6rem' }}
              />
              {item.title}
            </h4>
            <p>{item.subtitle}</p>
          </Item>
        )
      )}
    </motion.div>
  )
}
