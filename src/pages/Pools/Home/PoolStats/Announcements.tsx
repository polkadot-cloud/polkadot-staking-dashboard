// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faBullhorn as faBack } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BigNumber from 'bignumber.js';
import { useApi } from 'contexts/Api';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useUi } from 'contexts/UI';
import { motion } from 'framer-motion';
import { Announcement as AnnouncementLoader } from 'library/Loaders/Announcement';
import { useTranslation } from 'react-i18next';
import { greaterThanZero, planckToUnit, rmCommas } from 'Utils';
import { Item } from './Wrappers';

export const Announcements = () => {
  const { poolsSyncing } = useUi();
  const { network, consts } = useApi();
  const { selectedActivePool } = useActivePools();
  const { units, unit } = network;
  const { rewardAccountBalance } = selectedActivePool || {};
  const { totalRewardsClaimed } = selectedActivePool?.rewardPool || {};
  const { existentialDeposit } = consts;
  const { t } = useTranslation('pages');

  // calculate the latest reward account balance
  const rewardPoolBalance = BigNumber.max(
    new BigNumber(0),
    new BigNumber(rewardAccountBalance).minus(existentialDeposit)
  );
  const rewardBalance = planckToUnit(rewardPoolBalance, units);

  // calculate total rewards claimed
  const rewardsClaimed = planckToUnit(
    totalRewardsClaimed
      ? new BigNumber(rmCommas(totalRewardsClaimed))
      : new BigNumber(0),
    network.units
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

  if (greaterThanZero(rewardBalance)) {
    announcements.push({
      class: 'neutral',
      title: `${rewardBalance.decimalPlaces(3).toFormat()} ${unit} ${t(
        'pools.outstandingReward'
      )}`,
      subtitle: `${t('pools.availableToClaim', { unit })}`,
    });
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      style={{ width: '100%' }}
    >
      {poolsSyncing ? (
        <AnnouncementLoader />
      ) : (
        announcements.map((item, index) => (
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
        ))
      )}
    </motion.div>
  );
};
