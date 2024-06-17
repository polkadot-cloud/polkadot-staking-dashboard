// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { greaterThanZero, planckToUnit } from '@w3ux/utils';
import BigNumber from 'bignumber.js';
import { useTranslation } from 'react-i18next';
import { useStaking } from 'contexts/Staking';
import { ValidatorStatusWrapper } from 'library/ListItem/Wrappers';
import { useNetwork } from 'contexts/Network';
import type { NominationStatusProps } from '../types';
import { useSyncing } from 'hooks/useSyncing';

export const NominationStatus = ({
  address,
  nominator,
  bondFor,
  noMargin = false,
  status,
}: NominationStatusProps) => {
  const { t } = useTranslation('library');
  const {
    networkData: { unit, units },
  } = useNetwork();
  const {
    eraStakers: { activeAccountOwnStake, stakers },
  } = useStaking();
  const { syncing } = useSyncing(['era-stakers']);

  // determine staked amount
  let stakedAmount = new BigNumber(0);
  if (bondFor === 'nominator') {
    // bonded amount within the validator.
    stakedAmount =
      status === 'active'
        ? new BigNumber(
            activeAccountOwnStake?.find((own) => own.address)?.value ?? 0
          )
        : new BigNumber(0);
  } else {
    const staker = stakers?.find((s) => s.address === address);
    const exists = (staker?.others || []).find(({ who }) => who === nominator);
    if (exists) {
      stakedAmount = planckToUnit(new BigNumber(exists.value), units);
    }
  }

  return (
    <ValidatorStatusWrapper $status={status || 'waiting'} $noMargin={noMargin}>
      <h5>
        {t(`${status || 'waiting'}`)}
        {greaterThanZero(stakedAmount)
          ? ` / ${syncing ? '...' : `${stakedAmount.toFormat()} ${unit}`}`
          : null}
      </h5>
    </ValidatorStatusWrapper>
  );
};
