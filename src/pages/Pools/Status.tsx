// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Separator } from '../../Wrappers';
import { SectionWrapper } from '../../library/Graphs/Wrappers';
import { useApi } from '../../contexts/Api';
import { usePools } from '../../contexts/Pools';
import { useModal } from '../../contexts/Modal';
import { Stat } from '../../library/Stat';
import { APIContextInterface } from '../../types/api';
import { planckBnToUnit } from '../../Utils';

export const Status = () => {
  const { network } = useApi() as APIContextInterface;
  const { units, unit } = network;
  const { membership, isOwner, getPoolBondOptions } = usePools();
  const { openModalWith } = useModal();

  const { active } = getPoolBondOptions();

  // Pool status `Stat` props
  const labelMembership = membership ? 'Active in Pool' : 'Not in a Pool';

  let buttonsMembership;
  if (!membership) {
    buttonsMembership = [
      {
        title: 'Create Pool',
        small: true,
        onClick: () => openModalWith('CreatePool', { target: 'pool' }, 'small'),
      },
    ];
  } else if (isOwner()) {
    buttonsMembership = [
      {
        title: 'Destroy Pool',
        small: true,
        onClick: () =>
          openModalWith('Destroy Pool', { target: 'pool' }, 'small'),
      },
    ];
  } else {
    // check if the unlocking bonds are mature bofore letting someone leave the pool
    buttonsMembership = [
      {
        title: 'Leave Pool',
        small: true,
        onClick: () => openModalWith('LeavePool', { target: 'pool' }, 'small'),
      },
    ];
  }

  // Bonded in pool `Stat` props
  const labelBonded = membership
    ? `${planckBnToUnit(active, units)} ${unit}`
    : `0 ${unit}`;

  // Unclaimed rewards `Stat` props
  const labelRewards = membership
    ? `${membership.unclaimedRewards} ${unit}`
    : `0 ${unit}`;
  const buttonsRewards = membership
    ? [
        {
          title: 'Claim',
          small: true,
          onClick: () => {},
        },
      ]
    : undefined;

  return (
    <SectionWrapper style={{ height: 310 }}>
      <Stat
        label="Status"
        assistant={['pools', 'Pool Status']}
        stat={labelMembership}
        buttons={buttonsMembership}
      />
      <Separator />
      <Stat
        label="Bonded in Pool"
        assistant={['pools', 'Bonded in Pool']}
        stat={labelBonded}
      />
      <Separator />
      <Stat
        label="Unclaimed Rewards"
        assistant={['pools', 'Pool Rewards']}
        stat={labelRewards}
        buttons={buttonsRewards}
      />
    </SectionWrapper>
  );
};

export default Status;
