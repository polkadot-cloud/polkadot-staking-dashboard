// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullhorn as faBack } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { useApi } from 'contexts/Api';
import { useUi } from 'contexts/UI';
import {
  humanNumber,
  planckBnToUnit,
  rmCommas,
  toFixedIfNecessary,
} from 'Utils';
import { Announcement as AnnouncementLoader } from 'library/Loaders/Announcement';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useTranslation } from 'react-i18next';
import { Item } from './Wrappers';

export const Announcements = () => {
  const { isSyncing } = useUi();
  const { network, consts } = useApi();
  const { selectedActivePool } = useActivePools();
  const { units } = network;
  const { rewardAccountBalance } = selectedActivePool || {};
  const { totalRewardsClaimed } = selectedActivePool?.rewardPool || {};
  const { existentialDeposit } = consts;
  const { t } = useTranslation('common');

  // calculate the latest reward account balance
  const rewardPoolBalance = BN.max(
    new BN(0),
    new BN(rewardAccountBalance).sub(existentialDeposit)
  );
  const rewardBalance = toFixedIfNecessary(
    planckBnToUnit(rewardPoolBalance, units),
    3
  );

  // calculate total rewards claimed
  const rewardsClaimed = toFixedIfNecessary(
    planckBnToUnit(
      totalRewardsClaimed ? new BN(rmCommas(totalRewardsClaimed)) : new BN(0),
      network.units
    ),
    3
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
  const unit = network.unit;

  announcements.push({
    class: 'neutral',
    title: `${humanNumber(rewardsClaimed)} ${network.unit} ${t(
      'pages.pools.been_claimed'
    )}`,
    subtitle: `${t('pages.pools.poolstats1', { unit })}`,
  });

  if (rewardBalance > 0) {
    announcements.push({
      class: 'neutral',
      title: `${humanNumber(rewardBalance)} ${network.unit} ${t(
        'pages.pools.poolstats2'
      )}`,
      subtitle: `${t('pages.pools.poolstats3', { unit })}`,
    });
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      style={{ width: '100%' }}
    >
      {isSyncing ? (
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
