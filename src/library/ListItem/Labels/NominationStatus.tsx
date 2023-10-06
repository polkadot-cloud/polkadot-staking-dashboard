// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { greaterThanZero, planckToUnit } from '@polkadot-cloud/utils';
import BigNumber from 'bignumber.js';
import { useTranslation } from 'react-i18next';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { useStaking } from 'contexts/Staking';
import { ValidatorStatusWrapper } from 'library/ListItem/Wrappers';
import { useNominationStatus } from 'library/Hooks/useNominationStatus';
import { useNetwork } from 'contexts/Network';
import { useActiveAccount } from 'contexts/Connect/ActiveAccount';
import type { NominationStatusProps } from '../types';

export const NominationStatus = ({
  address,
  nominator,
  bondFor,
}: NominationStatusProps) => {
  const { t } = useTranslation('library');
  const {
    networkData: { unit, units },
  } = useNetwork();
  const { activeAccount } = useActiveAccount();
  const { getPoolNominationStatus } = useBondedPools();
  const { getNomineesStatus } = useNominationStatus();
  const {
    eraStakers: { activeAccountOwnStake, stakers },
    erasStakersSyncing,
  } = useStaking();

  let nominationStatus;
  if (bondFor === 'pool') {
    // get nomination status from pool metadata
    nominationStatus = getPoolNominationStatus(nominator, address);
  } else {
    // get all active account's nominations.
    const nominationStatuses = getNomineesStatus(activeAccount, 'nominator');
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
    const staker = stakers?.find((s) => s.address === address);
    const exists = (staker?.others || []).find(({ who }) => who === nominator);
    if (exists) {
      stakedAmount = planckToUnit(new BigNumber(exists.value), units);
    }
  }

  return (
    <ValidatorStatusWrapper $status={nominationStatus}>
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
