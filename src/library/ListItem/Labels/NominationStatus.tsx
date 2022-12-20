// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BN } from 'bn.js';
import { useApi } from 'contexts/Api';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { useStaking } from 'contexts/Staking';
import { ValidatorStatusWrapper } from 'library/ListItem/Wrappers';
import { useTranslation } from 'react-i18next';
import { humanNumber, planckBnToUnit, rmCommas } from 'Utils';
import { NominationStatusProps } from '../types';

export const NominationStatus = (props: NominationStatusProps) => {
  const { t } = useTranslation('library');
  const { getNominationsStatus, eraStakers, erasStakersSyncing } = useStaking();
  const { getPoolNominationStatus } = useBondedPools();
  const {
    network: { unit, units },
  } = useApi();

  const { ownStake, stakers } = eraStakers;
  const { address, nominator, bondType } = props;

  let nominationStatus;
  if (bondType === 'pool') {
    // get nomination status from pool metadata
    nominationStatus = getPoolNominationStatus(nominator, address);
  } else {
    // get all active account's nominations.
    const nominationStatuses = getNominationsStatus();
    // find the nominator status within the returned nominations.
    nominationStatus = nominationStatuses[address];
  }

  // determine staked amount
  let stakedAmount = 0;
  if (bondType === 'stake') {
    // bonded amount within the validator.
    stakedAmount =
      nominationStatus === 'active'
        ? ownStake?.find((_own: any) => _own.address)?.value ?? 0
        : 0;
  } else {
    const s = stakers?.find((_n: any) => _n.address === address);
    const exists = (s?.others ?? []).find((_o: any) => _o.who === nominator);
    if (exists) {
      stakedAmount = planckBnToUnit(new BN(rmCommas(exists.value)), units);
    }
  }

  return (
    <ValidatorStatusWrapper status={nominationStatus}>
      <h5>
        {t(`${nominationStatus}`)}
        {stakedAmount > 0 &&
          ` / ${
            erasStakersSyncing ? '...' : `${humanNumber(stakedAmount)} ${unit}`
          }`}
      </h5>
    </ValidatorStatusWrapper>
  );
};

export default NominationStatus;
