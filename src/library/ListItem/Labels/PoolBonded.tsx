// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { useState, useEffect } from 'react';
import { useApi } from 'contexts/Api';
import {
  capitalizeFirstLetter,
  humanNumber,
  planckBnToUnit,
  rmCommas,
  toFixedIfNecessary,
} from 'Utils';
import { ValidatorStatusWrapper } from 'library/ListItem/Wrappers';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { useStaking } from 'contexts/Staking';
import { Pool } from 'library/Pool/types';

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
  }, [meta]);

  // calculate total bonded pool amount
  const poolBonded = planckBnToUnit(new BN(rmCommas(points)), units);

  // determine nominations status and display
  const nominationStatus = getPoolNominationStatusCode(nominationsStatus);

  return (
    <>
      <ValidatorStatusWrapper status={nominationStatus}>
        <h5>
          {nominationStatus === null
            ? `Syncing...`
            : targets.length
            ? capitalizeFirstLetter(nominationStatus ?? '')
            : 'Not Nominating'}
          {' / '}
          Bonded: {humanNumber(toFixedIfNecessary(poolBonded, 3))} {unit}
        </h5>
      </ValidatorStatusWrapper>
    </>
  );
};
