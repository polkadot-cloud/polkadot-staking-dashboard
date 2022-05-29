// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useStaking } from 'contexts/Staking';
import { capitalizeFirstLetter } from 'Utils';
import { NominationStatusWrapper } from '../Wrappers';

export const NominationStatus = (props: any) => {
  const { getNominationsStatus } = useStaking();

  const { address } = props;

  const nominationStatuses = getNominationsStatus();
  const nominationStatus = nominationStatuses[address];

  return (
    <NominationStatusWrapper status={nominationStatus}>
      <h5>{capitalizeFirstLetter(nominationStatus)}</h5>
    </NominationStatusWrapper>
  );
};

export default NominationStatus;
