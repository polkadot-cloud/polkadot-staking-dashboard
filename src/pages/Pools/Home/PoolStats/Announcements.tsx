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
import { Item } from './Wrappers';

export const Announcements = () => {
  const { isSyncing } = useUi();
  const { network, consts } = useApi();
  const { selectedActivePool } = useActivePools();
  const { units } = network;
  const { rewardAccountBalance } = selectedActivePool || {};
  const { totalRewardsClaimed } = selectedActivePool?.rewardPool || {};
  const { existentialDeposit } = consts;

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

  announcements.push({
    class: 'neutral',
    title: `${humanNumber(rewardsClaimed)} ${
      network.unit
    } in rewards have been claimed.`,
    subtitle: `The total amount of ${network.unit} that has been claimed by pool members.`,
  });

  if (rewardBalance > 0) {
    announcements.push({
      class: 'neutral',
      title: `${humanNumber(rewardBalance)} ${
        network.unit
      } outstanding reward balance.`,
      subtitle: `The outstanding amount of ${network.unit} available to claim by pool members.`,
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
