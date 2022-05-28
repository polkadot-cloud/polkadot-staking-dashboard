// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { formatBalance } from '@polkadot/util';
import { useStaking } from 'contexts/Staking';
import { useUi } from 'contexts/UI';
import { Separator } from '../../Wrappers';
import { SectionWrapper } from '../../library/Graphs/Wrappers';
import { useApi } from '../../contexts/Api';
import { usePools } from '../../contexts/Pools';
import { useModal } from '../../contexts/Modal';
import { Stat } from '../../library/Stat';
import { APIContextInterface } from '../../types/api';

export const Status = () => {
  const { network } = useApi() as APIContextInterface;
  const { units, unit } = network;
  const { isSyncing } = useUi();
  const {
    membership,
    activeBondedPool,
    isOwner,
    getNominationsStatus,
    targets,
  } = usePools();
  const { openModalWith } = useModal();
  const { inSetup } = useStaking();

  // get nomination status
  const nominationStatuses = getNominationsStatus();
  const statuses: any =
    nominationStatuses === undefined ? [] : nominationStatuses;

  const active: any = Object.values(statuses).filter(
    (_v: any) => _v === 'active'
  ).length;

  // Pool status `Stat` props
  const labelMembership = membership
    ? `Active in Pool ${membership.pool.id}`
    : 'Not in a Pool';

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

  // Unclaimed rewards `Stat` props
  const { unclaimedReward } = activeBondedPool || {};
  const labelRewards = unclaimedReward
    ? `${formatBalance(unclaimedReward, {
        decimals: units,
        withSi: true,
        withUnit: unit,
      })}`
    : `0 ${unit}`;
  const buttonsRewards = unclaimedReward
    ? [
        {
          title: 'Claim',
          small: true,
          onClick: () =>
            openModalWith('ClaimReward', { target: 'pool' }, 'small'),
        },
      ]
    : undefined;

  return (
    <SectionWrapper height="300">
      <Stat
        label="Membership"
        assistant={['pools', 'Pool Status']}
        stat={labelMembership}
        buttons={buttonsMembership}
      />
      <Separator />
      <Stat
        label="Unclaimed Rewards"
        assistant={['pools', 'Pool Rewards']}
        stat={labelRewards}
        buttons={buttonsRewards}
      />
      {membership && (
        <>
          <Separator />
          <Stat
            label="Pool Status"
            assistant={['stake', 'Staking Status']}
            stat={
              inSetup() || isSyncing
                ? 'Inactive: Not Nominating'
                : !targets.nominations.length
                ? 'Inactive: Not Nominating'
                : active
                ? 'Actively Nominating with Pool Funds'
                : 'Waiting for Active Nominations'
            }
          />
        </>
      )}
    </SectionWrapper>
  );
};

export default Status;
