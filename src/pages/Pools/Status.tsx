// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { formatBalance } from '@polkadot/util';
import { useStaking } from 'contexts/Staking';
import { useUi } from 'contexts/UI';
import { Separator } from 'Wrappers';
import { CardWrapper } from 'library/Graphs/Wrappers';
import { useApi } from 'contexts/Api';
import { usePools } from 'contexts/Pools';
import { useModal } from 'contexts/Modal';
import { Stat } from 'library/Stat';
import { APIContextInterface } from 'types/api';
import {
  faChevronCircleRight,
  faPaperPlane,
  faSignOutAlt,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';

export const Status = () => {
  const { network, isReady } = useApi() as APIContextInterface;
  const { units, unit } = network;
  const { isSyncing } = useUi();
  const {
    membership,
    activeBondedPool,
    isOwner,
    getNominationsStatus,
    poolNominations,
  } = usePools();
  const { openModalWith } = useModal();
  const { inSetup } = useStaking();

  // get nomination status
  const nominationStatuses = getNominationsStatus();

  const active: any = Object.values(nominationStatuses).filter(
    (_v: any) => _v === 'active'
  ).length;

  const isNominating = !!poolNominations?.targets?.length;

  // Pool status `Stat` props
  const labelMembership = membership
    ? `Active in Pool ${membership.poolId}`
    : 'Not in a Pool';

  let buttonsMembership;
  if (!membership) {
    buttonsMembership = [
      {
        title: 'Create Pool',
        icon: faChevronCircleRight,
        transform: 'grow-1',
        disabled: !isReady,
        onClick: () => openModalWith('CreatePool', { target: 'pool' }, 'small'),
      },
    ];
  } else if (isOwner()) {
    buttonsMembership = [
      {
        title: 'Destroy Pool',
        icon: faTimesCircle,
        transform: 'grow-1',
        disabled: !isReady,
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
        icon: faSignOutAlt,
        disabled: !isReady,
        small: true,
        onClick: () => openModalWith('LeavePool', { target: 'pool' }, 'small'),
      },
    ];
  }

  // fallback to no buttons if app is syncing
  buttonsMembership = isSyncing ? [] : buttonsMembership;

  // Unclaimed rewards `Stat` props
  let { unclaimedReward } = activeBondedPool || {};
  unclaimedReward = unclaimedReward ?? new BN(0);

  const labelRewards = unclaimedReward
    ? `${formatBalance(unclaimedReward, {
      decimals: units,
      withSi: true,
      withUnit: unit,
    })} ${unit}`
    : `0 ${unit}`;
  const buttonsRewards = unclaimedReward.toNumber()
    ? [
      {
        title: 'Claim',
        icon: faPaperPlane,
        disabled: !isReady,
        small: true,
        onClick: () =>
          openModalWith('ClaimReward', { target: 'pool' }, 'small'),
      },
    ]
    : undefined;
  return (
    <CardWrapper height="300">
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
              isSyncing
                ? 'Inactive: Not Nominating'
                : !isNominating
                  ? 'Inactive: Not Nominating'
                  : active
                    ? 'Actively Nominating with Pool Funds'
                    : 'Waiting for Active Nominations'
            }
          />
        </>
      )}
    </CardWrapper>
  );
};

export default Status;
