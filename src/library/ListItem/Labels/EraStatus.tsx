// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BN } from 'bn.js';
import { useApi } from 'contexts/Api';
import { useStaking } from 'contexts/Staking';
import { useUi } from 'contexts/UI';
import { ValidatorStatusWrapper } from 'library/ListItem/Wrappers';
import { capitalizeFirstLetter, humanNumber, rmCommas } from 'Utils';

export const EraStatus = (props: any) => {
  const { address } = props;

  const {
    network: { unit, units },
  } = useApi();
  const { isSyncing } = useUi();
  const { eraStakers, erasStakersSyncing } = useStaking();
  const { stakers } = eraStakers;

  // is the validator in the active era
  const validatorInEra =
    stakers.find((s: any) => s.address === address) || null;

  // flag whether validator is active

  const validatorStatus = isSyncing
    ? 'waiting'
    : validatorInEra
    ? 'active'
    : 'waiting';

  let totalStakePlanck = new BN(0);
  if (validatorInEra) {
    const { others, own } = validatorInEra;
    others.forEach((o: any) => {
      totalStakePlanck = totalStakePlanck.add(new BN(rmCommas(o.value)));
    });
    if (own) {
      totalStakePlanck = totalStakePlanck.add(new BN(rmCommas(own)));
    }
  }

  const totalStake = totalStakePlanck.div(new BN(10 ** units)).toNumber();

  return (
    <ValidatorStatusWrapper status={validatorStatus}>
      <h5>
        {isSyncing || erasStakersSyncing
          ? 'Syncing...'
          : validatorInEra
          ? `Active / ${humanNumber(totalStake)} ${unit}`
          : capitalizeFirstLetter(validatorStatus ?? '')}
      </h5>
    </ValidatorStatusWrapper>
  );
};
