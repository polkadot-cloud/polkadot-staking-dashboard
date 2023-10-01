// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faBullhorn as faBack } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { planckToUnit, rmCommas } from '@polkadot-cloud/utils';
import BigNumber from 'bignumber.js';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { Announcement as AnnouncementLoader } from 'library/Loader/Announcement';
import { useNetwork } from 'contexts/Network';
import { Item } from './Wrappers';

export const Announcements = () => {
  const { t } = useTranslation('pages');
  const { consts } = useApi();
  const {
    networkData: { units, unit },
  } = useNetwork();
  const { selectedActivePool } = useActivePools();
  const { rewardAccountBalance } = selectedActivePool || {};
  const { totalRewardsClaimed } = selectedActivePool?.rewardPool || {};
  const { existentialDeposit } = consts;

  // calculate the latest reward account balance
  const rewardPoolBalance = BigNumber.max(
    0,
    new BigNumber(rewardAccountBalance).minus(existentialDeposit)
  );
  const rewardBalance = planckToUnit(rewardPoolBalance, units);

  // calculate total rewards claimed
  const rewardsClaimed = planckToUnit(
    totalRewardsClaimed
      ? new BigNumber(rmCommas(totalRewardsClaimed))
      : new BigNumber(0),
    units
  );

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.25,
      },
    },
  };

  const listItem = {
    hidden: {
      opacity: 0,
    },
    show: {
      opacity: 1,
    },
  };

  const announcements = [];

  announcements.push({
    class: 'neutral',
    title: `${rewardsClaimed.decimalPlaces(3).toFormat()} ${unit} ${t(
      'pools.beenClaimed'
    )}`,
    subtitle: `${t('pools.beenClaimedBy', { unit })}`,
  });

  announcements.push({
    class: 'neutral',
    title: `${rewardBalance.decimalPlaces(3).toFormat()} ${unit} ${t(
      'pools.outstandingReward'
    )}`,
    subtitle: `${t('pools.availableToClaim', { unit })}`,
  });

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
  );
};
