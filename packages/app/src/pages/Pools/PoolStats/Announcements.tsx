// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faBullhorn as faBack } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import BigNumber from 'bignumber.js'
import { getNetworkData } from 'consts/util'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { motion } from 'framer-motion'
import { Item } from 'library/Announcements/Wrappers'
import { Announcement as AnnouncementLoader } from 'library/Loader/Announcement'
import { useTranslation } from 'react-i18next'
import { planckToUnitBn } from 'utils'

export const Announcements = () => {
  const { t } = useTranslation('pages')
  const { network } = useNetwork()
  const { getChainSpec } = useApi()
  const { activePool } = useActivePool()

  const { unit, units } = getNetworkData(network)
  const { rewardAccountBalance } = activePool || {}
  const { totalRewardsClaimed } = activePool?.rewardPool || {}
  const { existentialDeposit } = getChainSpec(network)

  // calculate the latest reward account balance
  const rewardPoolBalance = BigNumber.max(
    0,
    new BigNumber(rewardAccountBalance || 0).minus(existentialDeposit)
  )
  const rewardBalance = planckToUnitBn(rewardPoolBalance, units)

  // calculate total rewards claimed
  const rewardsClaimed = planckToUnitBn(
    totalRewardsClaimed ? new BigNumber(totalRewardsClaimed) : new BigNumber(0),
    units
  )

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

  announcements.push({
    class: 'neutral',
    title: `${rewardsClaimed.decimalPlaces(3).toFormat()} ${unit} ${t(
      'beenClaimed'
    )}`,
    subtitle: `${t('beenClaimedBy', { unit })}`,
  })

  announcements.push({
    class: 'neutral',
    title: `${rewardBalance.decimalPlaces(3).toFormat()} ${unit} ${t(
      'outstandingReward'
    )}`,
    subtitle: `${t('availableToClaim', { unit })}`,
  })

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
