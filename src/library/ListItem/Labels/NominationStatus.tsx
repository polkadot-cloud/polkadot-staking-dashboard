// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { greaterThanZero, planckToUnit, rmCommas } from '@polkadotcloud/utils';
import BigNumber from 'bignumber.js';
import { useApi } from 'contexts/Api';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { useStaking } from 'contexts/Staking';
import { ValidatorStatusWrapper } from 'library/ListItem/Wrappers';
import { useTranslation } from 'react-i18next';
import type { NominationStatusProps } from '../types';

export const NominationStatus = ({
  address,
  nominator,
  bondFor,
}: NominationStatusProps) => {
  const { t } = useTranslation('library');
  const { getNominationsStatus, eraStakers, erasStakersSyncing } = useStaking();
  const { getPoolNominationStatus } = useBondedPools();
  const {
    network: { unit, units },
  } = useApi();

  const { stakers } = eraStakers;

  let nominationStatus;
  if (bondFor === 'pool') {
    // get nomination status from pool metadata
    nominationStatus = getPoolNominationStatus(nominator, address);
  } else {
    // get all active account's nominations.
    const nominationStatuses = getNominationsStatus();
    // find the nominator status within the returned nominations.
    nominationStatus = nominationStatuses[address];
  }

  // determine staked amount
  let stakedAmount = new BigNumber(0);
  const isActive = nominationStatus === 'active';
  const stake = stakers.find((x) => x.address === address);
  if (isActive && stake && stake.own) {
    stakedAmount = planckToUnit(new BigNumber(rmCommas(stake.own)), units);
  }

  return (
    <ValidatorStatusWrapper status={nominationStatus}>
      <h5>
        {t(`${nominationStatus}`)}
        {greaterThanZero(stakedAmount)
          ? ` / ${
              erasStakersSyncing ? '...' : `${stakedAmount.toFormat()} ${unit}`
            }`
          : null}
      </h5>
    </ValidatorStatusWrapper>
  );
};
