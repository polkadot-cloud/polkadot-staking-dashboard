// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BigNumber from 'bignumber.js';
import { useApi } from 'contexts/Api';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { useStaking } from 'contexts/Staking';
import { ValidatorStatusWrapper } from 'library/ListItem/Wrappers';
import { useTranslation } from 'react-i18next';
import { greaterThanZero, planckToUnit, rmCommas } from 'Utils';
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

  const { activeAccountOwnStake, stakers } = eraStakers;

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
  if (bondFor === 'nominator') {
    // bonded amount within the validator.
    stakedAmount =
      nominationStatus === 'active'
        ? new BigNumber(
            activeAccountOwnStake?.find((own: any) => own.address)?.value ?? 0
          )
        : new BigNumber(0);
  } else {
    const s = stakers?.find((_n: any) => _n.address === address);
    const exists = (s?.others ?? []).find((_o: any) => _o.who === nominator);
    if (exists) {
      stakedAmount = planckToUnit(new BigNumber(rmCommas(exists.value)), units);
    }
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
