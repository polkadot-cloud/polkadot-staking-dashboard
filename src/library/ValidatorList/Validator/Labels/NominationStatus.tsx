// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import { usePools } from 'contexts/Pools';
import { useStaking } from 'contexts/Staking';
import { APIContextInterface } from 'types/api';
import { capitalizeFirstLetter } from 'Utils';
import { NominationStatusWrapper } from '../Wrappers';

export const NominationStatus = (props: any) => {
  const { getNominationsStatus, eraStakers, erasStakersSyncing } = useStaking();
  const { getNominationsStatus: poolsGetNominationsStatus } = usePools();
  const {
    network: { unit },
  } = useApi() as APIContextInterface;

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
          ` / ${erasStakersSyncing ? '...' : `${ownStaked} ${unit}`}`}
      </h5>
    </NominationStatusWrapper>
  );
};

export default NominationStatus;
