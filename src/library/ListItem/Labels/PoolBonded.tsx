// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { useApi } from 'contexts/Api';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { useStaking } from 'contexts/Staking';
import { ValidatorStatusWrapper } from 'library/ListItem/Wrappers';
import { Pool } from 'library/Pool/types';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  capitalizeFirstLetter,
  humanNumber,
  planckBnToUnit,
  rmCommas,
  toFixedIfNecessary,
} from 'Utils';

export const PoolBonded = ({
  pool,
  batchKey,
  batchIndex,
}: {
  pool: Pool;
  batchKey: string;
  batchIndex: number;
}) => {
  const { addresses, points } = pool;
  const { t } = useTranslation('library');

  const { network } = useApi();
  const { eraStakers, getNominationsStatusFromTargets } = useStaking();
  const { meta, getPoolNominationStatusCode } = useBondedPools();
  const { units, unit } = network;

  // get pool targets from nominations meta batch
  const nominations = meta[batchKey]?.nominations ?? [];
  const targets = nominations[batchIndex]?.targets ?? [];

  // store nomination status in state
  const [nominationsStatus, setNominationsStatus] = useState<{
    [key: string]: string;
  } | null>(null);

  // update pool nomination status as nominations metadata becomes available.
  // we cannot add effect dependencies here as this needs to trigger
  // as soon as the component displays. (upon tab change).
  const handleNominationsStatus = () => {
    const _nominationStatus = getNominationsStatusFromTargets(
      addresses.stash,
      targets
    );
    setNominationsStatus(_nominationStatus);
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
  const poolBonded = planckBnToUnit(new BN(rmCommas(points)), units);

  // determine nominations status and display
  const nominationStatus = getPoolNominationStatusCode(nominationsStatus);

  return (
    <>
      <ValidatorStatusWrapper status={nominationStatus}>
        <h5>
          {nominationStatus === null || !eraStakers.stakers.length
            ? `${t('syncing')}`
            : targets.length
            ? capitalizeFirstLetter(t(`${nominationStatus}`) ?? '')
            : t('not_nominating')}
          {' / '}
          {t('bonded')} {humanNumber(toFixedIfNecessary(poolBonded, 3))} {unit}
        </h5>
      </ValidatorStatusWrapper>
    </>
  );
};
