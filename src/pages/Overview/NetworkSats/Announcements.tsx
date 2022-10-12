// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullhorn as faBack } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { useStaking } from 'contexts/Staking';
import { useApi } from 'contexts/Api';
import { useUi } from 'contexts/UI';
import {
  humanNumber,
  planckBnToUnit,
  rmCommas,
  toFixedIfNecessary,
} from 'Utils';
import { Announcement as AnnouncementLoader } from 'library/Loaders/Announcement';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { useNetworkMetrics } from 'contexts/Network';
import { BondedPool } from 'contexts/Pools/types';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { Item } from './Wrappers';

export const Announcements = () => {
  const { isSyncing } = useUi();
  const { network } = useApi();
  const { units } = network;
  const { staking } = useStaking();
  const { metrics } = useNetworkMetrics();
  const {
    minNominatorBond,
    totalNominators,
    maxNominatorsCount,
    lastTotalStake,
  } = staking;
  const { bondedPools } = useBondedPools();
  const { totalIssuance } = metrics;
  const { t } = useTranslation('common');

  let totalPoolPoints = new BN(0);
  bondedPools.forEach((b: BondedPool) => {
    totalPoolPoints = totalPoolPoints.add(new BN(rmCommas(b.points)));
  });
  const totalPoolPointsBase = humanNumber(
    toFixedIfNecessary(planckBnToUnit(totalPoolPoints, units), 0)
  );

  // total supply as percent
  let supplyAsPercent = 0;
  if (totalIssuance.gt(new BN(0))) {
    supplyAsPercent = lastTotalStake
      .div(totalIssuance.div(new BN(100)))
      .toNumber();
  }
  const lastTotalStakeBase = lastTotalStake.div(new BN(10 ** units));

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
  if (nominatorCapReached) {
    announcements.push({
      class: 'danger',
      title: t('pages.overview.announcements1'),
      subtitle: t('pages.overview.announcements2'),
    });
  }

  // 90% plus nominators reached - warning
  if (nominatorReachedPercentage.toNumber() >= 90) {
    announcements.push({
      class: 'warning',
      title: `${toFixedIfNecessary(
        nominatorReachedPercentage.toNumber(),
        2
      )} ${t('pages.overview.announcements3')}`,
      subtitle: `${t('pages.overview.announcements4')} ${humanNumber(
        maxNominatorsCount.toNumber()
      )}.`,
    });
  }
  const network_name = network.name;
  const network_unit = network.unit;
  // bonded pools available
  if (bondedPools.length) {
    // total pools active
    announcements.push({
      class: 'pools',
      title: `${bondedPools.length} ${t('pages.overview.announcements5')}`,
      subtitle: `${t('pages.overview.available_to_join', { network_name })}`,
    });

    // total locked in pols
    announcements.push({
      class: 'pools',
      title: `${totalPoolPointsBase} ${network.unit} ${t(
        'pages.overview.announcements7'
      )}`,
      subtitle: `${t('pages.overview.the_total', { network_unit })}`,
    });
  }

  // minimum nominator bond
  announcements.push({
    class: 'neutral',
    title: `${t('pages.overview.announcements9')} ${minNominatorBondBase} ${
      network.unit
    }.`,
    subtitle: `${t('pages.overview.minimum_bonding_amount', {
      network_name,
    })}${planckBnToUnit(minNominatorBond, units)} ${network.unit}.`,
  });
  const _lastTotalStakeBase = humanNumber(lastTotalStakeBase.toNumber());
  // supply staked
  announcements.push({
    class: 'neutral',
    title: `${t('pages.overview.currently_staked', {
      supplyAsPercent,
      network_unit,
    })}`,
    subtitle: `${t('pages.overview.staking_on_the_network', {
      _lastTotalStakeBase,
      network_unit,
    })}`,
  });

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
