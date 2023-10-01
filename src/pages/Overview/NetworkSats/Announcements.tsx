// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faBullhorn as faBack } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  capitalizeFirstLetter,
  planckToUnit,
  rmCommas,
  sortWithNull,
} from '@polkadot-cloud/utils';
import BigNumber from 'bignumber.js';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { usePoolsConfig } from 'contexts/Pools/PoolsConfig';
import type { BondedPool } from 'contexts/Pools/types';
import { useStaking } from 'contexts/Staking';
import { useUi } from 'contexts/UI';
import { Announcement as AnnouncementLoader } from 'library/Loader/Announcement';
import { useNetwork } from 'contexts/Network';
import { Item } from './Wrappers';

export const Announcements = () => {
  const { t } = useTranslation('pages');
  const { isSyncing } = useUi();
  const { staking } = useStaking();
  const { stats } = usePoolsConfig();
  const {
    network,
    networkData: { units, unit },
  } = useNetwork();
  const { bondedPools } = useBondedPools();

  const { totalStaked } = staking;
  const { counterForPoolMembers } = stats;

  let totalPoolPoints = new BigNumber(0);
  bondedPools.forEach((b: BondedPool) => {
    totalPoolPoints = totalPoolPoints.plus(rmCommas(b.points));
  });
  const totalPoolPointsUnit = planckToUnit(totalPoolPoints, units);

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

  const networkUnit = unit;

  // total staked on the network
  if (!isSyncing) {
    announcements.push({
      class: 'neutral',
      title: t('overview.networkCurrentlyStaked', {
        total: planckToUnit(totalStaked, units).integerValue().toFormat(),
        unit,
        network: capitalizeFirstLetter(network),
      }),
      subtitle: t('overview.networkCurrentlyStakedSubtitle', {
        unit,
      }),
    });
  } else {
    announcements.push(null);
  }

  // total locked in pools
  if (bondedPools.length) {
    announcements.push({
      class: 'neutral',
      title: `${totalPoolPointsUnit.integerValue().toFormat()} ${unit} ${t(
        'overview.inPools'
      )}`,
      subtitle: `${t('overview.bondedInPools', { networkUnit })}`,
    });
  } else {
    announcements.push(null);
  }

  if (counterForPoolMembers.isGreaterThan(0)) {
    // total locked in pools
    announcements.push({
      class: 'neutral',
      title: `${counterForPoolMembers.toFormat()} ${t(
        'overview.poolMembersBonding'
      )}`,
      subtitle: `${t('overview.totalNumAccounts')}`,
    });
  } else {
    announcements.push(null);
  }

  announcements.sort(sortWithNull(true));

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
