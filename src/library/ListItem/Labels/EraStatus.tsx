// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BN } from 'bn.js';
import { useApi } from 'contexts/Api';
import { useStaking } from 'contexts/Staking';
import { capitalizeFirstLetter, humanNumber, rmCommas } from 'Utils';
import { ValidatorStatusWrapper } from 'library/ListItem/Wrappers';
import { useUi } from 'contexts/UI';
import { useTranslation } from 'react-i18next';

export const EraStatus = (props: any) => {
  const { address } = props;

  const {
    network: { unit, units },
  } = useApi();
  const { isSyncing } = useUi();
  const { eraStakers, erasStakersSyncing } = useStaking();
  const { stakers } = eraStakers;
  const { t } = useTranslation('common');

  // is the validator in the active era
  const validatorInEra =
    stakers.find((s: any) => s.address === address) || null;

  // flag whether validator is active

  const validatorStatus = isSyncing
    ? t('library.waiting')
    : validatorInEra
    ? t('library.active')
    : t('library.waiting');

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
          ? t('library.syncing')
          : validatorInEra
          ? `${t('library.active1')} / ${humanNumber(totalStake)} ${unit}`
          : validatorStatus ?? ''}
      </h5>
    </ValidatorStatusWrapper>
  );
};
