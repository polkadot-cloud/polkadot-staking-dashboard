// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faBullhorn as faBack } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BN from 'bn.js';
import { useApi } from 'contexts/Api';
import { useNetworkMetrics } from 'contexts/Network';
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
  const { networkSyncing, poolsSyncing } = useUi();
  const { network } = useApi();
  const { units } = network;
  const { staking } = useStaking();
  const { metrics } = useNetworkMetrics();
  const { poolMembers } = usePoolMembers();

  const { minNominatorBond, lastTotalStake } = staking;
  const { bondedPools } = useBondedPools();
  const { totalIssuance } = metrics;
  const { t } = useTranslation('pages');

  let totalPoolPoints = new BN(0);
  bondedPools.forEach((b: BondedPool) => {
    totalPoolPoints = totalPoolPoints.add(new BN(rmCommas(b.points)));
  });
  const totalPoolPointsBase = humanNumber(
    toFixedIfNecessary(planckBnToUnit(totalPoolPoints, units), 0)
  );

  // total supply as percent
  // total supply as percent
  const totalIssuanceBase = planckBnToUnit(totalIssuance, units);
  const lastTotalStakeBase = planckBnToUnit(lastTotalStake, units);
  const supplyAsPercent =
    lastTotalStakeBase === 0
      ? 0
      : lastTotalStakeBase / (totalIssuanceBase * 0.01);

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

  const minNominatorBondBase = planckBnToUnit(minNominatorBond, units);
  const announcements = [];

  const networkName = network.name;
  const networkUnit = network.unit;
  // bonded pools available
  if (bondedPools.length) {
    // total pools active
    announcements.push({
      class: 'neutral',
      title: `${bondedPools.length} ${t('overview.poolsAreActive')}`,
      subtitle: `${t('overview.availableToJoin', { networkName })}`,
    });

    // total locked in pools
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

  // minimum nominator bond
  announcements.push({
    class: 'neutral',
    title: `${t('overview.minimumNominatorBond')} ${minNominatorBondBase} ${
      network.unit
    }.`,
    subtitle: `${t('overview.minimumBondingAmount', {
      networkName,
    })}${planckBnToUnit(minNominatorBond, units)} ${network.unit}.`,
  });

  // supply staked
  announcements.push({
    class: 'neutral',
    title: `${t('overview.currentlyStaked', {
      supplyAsPercent: toFixedIfNecessary(supplyAsPercent, 2),
      networkUnit,
    })}`,
    subtitle: `${t('overview.stakingOnNetwork', {
      lastTotalStakeBase: humanNumber(
        toFixedIfNecessary(lastTotalStakeBase, 0)
      ),
      networkUnit,
    })}`,
  });

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
