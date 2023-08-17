// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  capitalizeFirstLetter,
  planckToUnit,
  rmCommas,
} from '@polkadot-cloud/utils';
import BigNumber from 'bignumber.js';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { useStaking } from 'contexts/Staking';
import { ValidatorStatusWrapper } from 'library/ListItem/Wrappers';
import type { Pool } from 'library/Pool/types';

export const PoolBonded = ({
  pool,
  batchKey,
  batchIndex,
}: {
  pool: Pool;
  batchKey: string;
  batchIndex: number;
}) => {
  const { t } = useTranslation('library');
  const { network } = useApi();
  const { eraStakers, getNominationsStatusFromTargets } = useStaking();
  const { meta, getPoolNominationStatusCode } = useBondedPools();
  const { addresses, points } = pool;
  const { units, unit } = network;

  // get pool targets from nominations meta batch
  const nominations = meta[batchKey]?.nominations ?? [];
  const targets = nominations[batchIndex]?.targets ?? [];

  // store nomination status in state
  const [nominationsStatus, setNominationsStatus] =
    useState<Record<string, string>>();

  // update pool nomination status as nominations metadata becomes available.
  // we cannot add effect dependencies here as this needs to trigger
  // as soon as the component displays. (upon tab change).
  const handleNominationsStatus = () => {
    setNominationsStatus(
      getNominationsStatusFromTargets(addresses.stash, targets)
    );
  };

  // recalculate nominations status as app syncs
  useEffect(() => {
    if (
      targets.length &&
      nominationsStatus === null &&
      eraStakers.stakers.length &&
      nominations.length
    ) {
      handleNominationsStatus();
    }
  });

  // metadata has changed, which means pool items may have been added.
  // recalculate nominations status
  useEffect(() => {
    handleNominationsStatus();
  }, [meta, pool, eraStakers.stakers.length]);

  // calculate total bonded pool amount
  const poolBonded = planckToUnit(new BigNumber(rmCommas(points)), units);

  // determine nominations status and display
  const nominationStatus = getPoolNominationStatusCode(
    nominationsStatus || null
  );

  return (
    <>
      <ValidatorStatusWrapper $status={nominationStatus}>
        <h5>
          {nominationStatus === null || !eraStakers.stakers.length
            ? `${t('syncing')}...`
            : targets.length
            ? capitalizeFirstLetter(t(`${nominationStatus}`) ?? '')
            : t('notNominating')}
          {' / '}
          {t('bonded')}: {poolBonded.decimalPlaces(3).toFormat()} {unit}
        </h5>
      </ValidatorStatusWrapper>
    </>
  );
};
