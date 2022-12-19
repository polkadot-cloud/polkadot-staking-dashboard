// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faBullhorn as faBack } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BN from 'bn.js';
import { useApi } from 'contexts/Api';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { usePoolMembers } from 'contexts/Pools/PoolMembers';
import { BondedPool } from 'contexts/Pools/types';
import { useStaking } from 'contexts/Staking';
import { useUi } from 'contexts/UI';
import { motion } from 'framer-motion';
import { Announcement as AnnouncementLoader } from 'library/Loaders/Announcement';
import { useTranslation } from 'react-i18next';
import {
  humanNumber,
  planckBnToUnit,
  rmCommas,
  toFixedIfNecessary,
} from 'Utils';
import { Item } from './Wrappers';

export const Announcements = () => {
  const { t } = useTranslation('pages');
  const { networkSyncing, poolsSyncing, isSyncing } = useUi();
  const { network } = useApi();
  const { eraStakers } = useStaking();
  const { units } = network;
  const { poolMembers } = usePoolMembers();
  const { bondedPools } = useBondedPools();
  const { totalStaked } = eraStakers;

  let totalPoolPoints = new BN(0);
  bondedPools.forEach((b: BondedPool) => {
    totalPoolPoints = totalPoolPoints.add(new BN(rmCommas(b.points)));
  });
  const totalPoolPointsBase = humanNumber(
    toFixedIfNecessary(planckBnToUnit(totalPoolPoints, units), 0)
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

  const networkUnit = network.unit;

  // total staked on the network
  if (!isSyncing) {
    announcements.push({
      class: 'neutral',
      title: `${humanNumber(
        toFixedIfNecessary(planckBnToUnit(totalStaked, units), 0)
      )} ${network.unit} is currently being staked on ${network.name}.`,
      subtitle: `The total ${network.unit} currently being staked amongst all validators and nominators.`,
    });
  }

  // total locked in pools
  if (bondedPools.length) {
    announcements.push({
      class: 'neutral',
      title: `${totalPoolPointsBase} ${network.unit} ${t('overview.inPools')}`,
      subtitle: `${t('overview.bondedInPools', { networkUnit })}`,
    });

    if (poolMembers.length > 0 && !poolsSyncing) {
      // total locked in pols
      announcements.push({
        class: 'neutral',
        title: `${humanNumber(poolMembers.length)} ${t(
          'overview.poolMembersBonding'
        )}`,
        subtitle: `${t('overview.totalNumAccounts')}`,
      });
    }
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      style={{ width: '100%' }}
    >
      {networkSyncing ? (
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
