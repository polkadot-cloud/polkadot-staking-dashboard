// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Separator } from '../../Wrappers';
import { SectionWrapper } from '../../library/Graphs/Wrappers';
import { useApi } from '../../contexts/Api';
import { usePools } from '../../contexts/Pools';
import { useConnect } from '../../contexts/Connect';
import { useModal } from '../../contexts/Modal';
import { Stat } from '../../library/Stat';

export const Status = () => {
  const { network }: any = useApi();
  const { activeAccount } = useConnect();
  const { membership } = usePools();
  const { openModalWith } = useModal();

  // Pool status `Stat` props
  const labelMembership = membership ? 'Active in Pool' : 'Not in a Pool';
  const buttonsMembership = !membership
    ? [
        {
          title: 'Create Pool',
          small: true,
          onClick: () =>
            openModalWith('CreatePool', { target: 'pool' }, 'small'),
        },
      ]
    : undefined;

  // Bonded in pool `Stat` props
  const labelBonded = membership
    ? `${membership.bondedAmount} ${network.unit}`
    : `0 ${network.unit}`;
  const buttonsBonded = membership
    ? [
        {
          title: '+',
          small: true,
          onClick: () => {},
        },
        {
          title: '-',
          small: true,
          onClick: () => {},
        },
      ]
    : undefined;

  // Unclaimed rewards `Stat` props
  const labelRewards = membership
    ? `${membership.unclaimedRewards} ${network.unit}`
    : `0 ${network.unit}`;
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
        buttons={buttonsBonded}
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
