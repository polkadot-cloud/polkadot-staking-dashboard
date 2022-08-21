// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import { useStaking } from 'contexts/Staking';
import { capitalizeFirstLetter, humanNumber } from 'Utils';
import { NominationStatusWrapper } from 'library/ListItem/Wrappers';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { NominationStatusProps } from '../types';

export const NominationStatus = (props: NominationStatusProps) => {
  const { getNominationsStatus, eraStakers, erasStakersSyncing } = useStaking();
  const { getPoolNominationStatus } = useBondedPools();
  const {
    network: { unit },
  } = useApi();

  const { ownStake } = eraStakers;
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

  // TODO: this only works as staker, not as a pool. Expand to find pool's
  // bonded amount within the validator.
  const ownStaked =
    nominationStatus === 'active'
      ? ownStake?.find((_own: any) => _own.address)?.value ?? 0
      : 0;

  return (
    <NominationStatusWrapper status={nominationStatus}>
      <h5>
        {capitalizeFirstLetter(nominationStatus ?? '')}
        {ownStaked > 0 &&
          ` / ${
            erasStakersSyncing ? '...' : `${humanNumber(ownStaked)} ${unit}`
          }`}
      </h5>
    </NominationStatusWrapper>
  );
};

export default NominationStatus;
