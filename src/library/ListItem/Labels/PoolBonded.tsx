// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { useApi } from 'contexts/Api';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { useStaking } from 'contexts/Staking';
import { ValidatorStatusWrapper } from 'library/ListItem/Wrappers';
import { Pool } from 'library/Pool/types';
import { useEffect, useState } from 'react';
import {
  humanNumber,
  planckBnToUnit,
  rmCommas,
  toFixedIfNecessary,
} from 'Utils';
import { useTranslation } from 'react-i18next';

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

  const { network } = useApi();
  const { eraStakers, getNominationsStatusFromTargets } = useStaking();
  const { meta, getPoolNominationStatusCode } = useBondedPools();
  const { units, unit } = network;
  const { t } = useTranslation('common');

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
  }, [meta, pool]);

  // calculate total bonded pool amount
  const poolBonded = planckBnToUnit(new BN(rmCommas(points)), units);

  // determine nominations status and display
  const nominationStatus = getPoolNominationStatusCode(nominationsStatus);

  return (
    <>
      <ValidatorStatusWrapper status={nominationStatus}>
        <h5>
          {nominationStatus === null
            ? `${t('library.syncing')}`
            : targets.length
            ? nominationStatus ?? ''
            : t('library.not_nominating')}
          {' / '}
          {t('library.bonded')} {humanNumber(toFixedIfNecessary(poolBonded, 3))}{' '}
          {unit}
        </h5>
      </ValidatorStatusWrapper>
    </>
  );
};
