// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import { useActivePool } from 'contexts/Pools/ActivePool';
import { useStaking } from 'contexts/Staking';
import { ActivePoolContextState } from 'types/pools';
import { StakingContextInterface } from 'types/staking';
import { capitalizeFirstLetter, humanNumber } from 'Utils';
import { NominationStatusWrapper } from '../Wrappers';
import { NominationStatusProps } from '../types';

export const NominationStatus = (props: NominationStatusProps) => {
  const { getNominationsStatus, eraStakers, erasStakersSyncing } =
    useStaking() as StakingContextInterface;
  const { getNominationsStatus: poolsGetNominationsStatus } =
    useActivePool() as ActivePoolContextState;
  const {
    network: { unit },
  } = useApi();

  const { ownStake } = eraStakers;

  const { address, bondType } = props;

  let nominationStatuses;
  if (bondType === 'pool') {
    nominationStatuses = poolsGetNominationsStatus();
  } else {
    nominationStatuses = getNominationsStatus();
  }

  const nominationStatus = nominationStatuses[address];

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
