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
  const { networkSyncing, poolsSyncing, isSyncing } = useUi();
  const { network } = useApi();
  const { units } = network;
  const { staking } = useStaking();
  const { metrics } = useNetworkMetrics();
  const { poolMembers } = usePoolMembers();

  const {
    minNominatorBond,
    totalNominators,
    maxNominatorsCount,
    lastTotalStake,
  } = staking;
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

  const nominatorCapReached = maxNominatorsCount.eq(totalNominators);

  let nominatorReachedPercentage = new BN(0);
  if (maxNominatorsCount.gt(new BN(0)) && totalNominators.gt(new BN(0))) {
    nominatorReachedPercentage = totalNominators.div(
      maxNominatorsCount.div(new BN(100))
    );
  }

  const minNominatorBondBase = planckBnToUnit(minNominatorBond, units);

  const announcements = [];

  // maximum nominators have been reached
  if (nominatorCapReached && !isSyncing) {
    announcements.push({
      class: 'danger',
      title: t('overview.nominator_limit'),
      subtitle: t('overview.maximum_allowed'),
    });
  }

  // 90% plus nominators reached
  if (nominatorReachedPercentage.toNumber() >= 90) {
    announcements.push({
      class: 'neutral',
      title: `${toFixedIfNecessary(
        nominatorReachedPercentage.toNumber(),
        2
      )}${t('overview.limit_reached')}`,
      subtitle: `${t('overview.maximum_amount')} ${humanNumber(
        maxNominatorsCount.toNumber()
      )}.`,
    });
  }

  const networkName = network.name;
  const networkUnit = network.unit;
  // bonded pools available
  if (bondedPools.length) {
    // total pools active
    announcements.push({
      class: 'pools',
      title: `${bondedPools.length} ${t('overview.pools_are_active')}`,
      subtitle: `${t('overview.available_to_join', { networkName })}`,
    });

    // total locked in pools
    announcements.push({
      class: 'pools',
      title: `${totalPoolPointsBase} ${network.unit} ${t('overview.in_pools')}`,
      subtitle: `${t('overview.bonded_in_pools', { networkUnit })}`,
    });

    if (poolMembers.length > 0 && !poolsSyncing) {
      // total locked in pols
      announcements.push({
        class: 'pools',
        title: `${humanNumber(poolMembers.length)} ${t(
          'overview.pool_members_bonding'
        )}`,
        subtitle: `${t('overview.total_num_accounts')}`,
      });
    }
  }

  // minimum nominator bond
  announcements.push({
    class: 'neutral',
    title: `${t('overview.minimum_nominator_bond')} ${minNominatorBondBase} ${
      network.unit
    }.`,
    subtitle: `${t('overview.minimum_bonding_amount', {
      networkName,
    })} ${planckBnToUnit(minNominatorBond, units)} ${network.unit}.`,
  });

  // supply staked
  announcements.push({
    class: 'neutral',
    title: `${t('overview.currently_staked', {
      supplyAsPercent: toFixedIfNecessary(supplyAsPercent, 2),
      networkUnit,
    })}`,
    subtitle: `${t('overview.staking_on_the_network', {
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
