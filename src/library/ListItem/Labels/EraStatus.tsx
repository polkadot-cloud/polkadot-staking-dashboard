// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BigNumber from 'bignumber.js';
import { useApi } from 'contexts/Api';
import { useStaking } from 'contexts/Staking';
import { useUi } from 'contexts/UI';
import { ValidatorStatusWrapper } from 'library/ListItem/Wrappers';
import { useTranslation } from 'react-i18next';
import { MaybeAccount } from 'types';
import { capitalizeFirstLetter, planckToUnit, rmCommas } from 'Utils';

export const EraStatus = ({ address }: { address: MaybeAccount }) => {
  const { t } = useTranslation('library');
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

  let totalStakePlanck = new BigNumber(0);
  if (validatorInEra) {
    const { others, own } = validatorInEra;
    others.forEach((o: any) => {
      totalStakePlanck = totalStakePlanck.plus(rmCommas(o.value));
    });
    if (own) {
      totalStakePlanck = totalStakePlanck.plus(rmCommas(own));
    }
  }

  const totalStake = planckToUnit(totalStakePlanck, units);

  return (
    <ValidatorStatusWrapper status={validatorStatus}>
      <h5>
        {isSyncing || erasStakersSyncing
          ? t('syncing')
          : validatorInEra
          ? `${t('listItemActive')} / ${totalStake
              .integerValue()
              .toFormat()} ${unit}`
          : capitalizeFirstLetter(t(`${validatorStatus}`) ?? '')}
      </h5>
    </ValidatorStatusWrapper>
  );
};
