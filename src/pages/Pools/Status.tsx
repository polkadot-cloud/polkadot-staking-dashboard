// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { APIContextInterface } from 'types/api';
import { ConnectContextInterface } from 'types/connect';
import {
  PoolMembershipsContextState,
  ActivePoolContextState,
  PoolState,
} from 'types/pools';
import BN from 'bn.js';
import { formatBalance } from '@polkadot/util';
import { useUi } from 'contexts/UI';
import { Separator } from 'Wrappers';
import { CardWrapper } from 'library/Graphs/Wrappers';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useActivePool } from 'contexts/Pools/ActivePool';
import { useModal } from 'contexts/Modal';
import { Stat } from 'library/Stat';

import {
  faChevronCircleRight,
  faPaperPlane,
  faSignOutAlt,
  faTimesCircle,
  faLock,
  faLockOpen,
} from '@fortawesome/free-solid-svg-icons';
import { usePoolMemberships } from 'contexts/Pools/PoolMemberships';

export const Status = () => {
  const { network, isReady } = useApi() as APIContextInterface;
  const { activeAccount } = useConnect() as ConnectContextInterface;
  const { units, unit } = network;
  const { isSyncing } = useUi();
  const { membership } = usePoolMemberships() as PoolMembershipsContextState;
  const {
    activeBondedPool,
    poolNominations,
    isOwner,
    getNominationsStatus,
    getPoolBondOptions,
  } = useActivePool() as ActivePoolContextState;
  const { openModalWith } = useModal();
  const { active } = getPoolBondOptions(activeAccount);
  const nominationStatuses = getNominationsStatus();
  const activeNominations: any = Object.values(nominationStatuses).filter(
    (_v: any) => _v === 'active'
  ).length;
  const isNominating = !!poolNominations?.targets?.length;

  // Pool status `Stat` props
  const { label, buttons } = (() => {
    let _label;
    let _buttons;
    const createBtn = {
      title: 'Create Pool',
      icon: faChevronCircleRight,
      transform: 'grow-1',
      disabled: !isReady,
      onClick: () => openModalWith('CreatePool', { bondType: 'pool' }, 'small'),
    };
    const leaveBtn = {
      title: 'Leave Pool',
      icon: faSignOutAlt,
      disabled: !isReady,
      small: true,
      onClick: () => openModalWith('LeavePool', { bondType: 'pool' }, 'small'),
    };
    const destroyBtn = {
      title: 'Destroy Pool',
      icon: faTimesCircle,
      transform: 'grow-1',
      disabled: !isReady,
      small: true,
      onClick: () =>
        openModalWith(
          'ChangePoolState',
          { bondType: 'pool', state: PoolState.Destroy },
          'small'
        ),
    };
    const blockBtn = {
      title: 'Lock Pool',
      icon: faLock,
      transform: 'grow-1',
      disabled: !isReady,
      small: true,
      onClick: () =>
        openModalWith(
          'ChangePoolState',
          { bondType: 'pool', state: PoolState.Block },
          'small'
        ),
    };
    const openBtn = {
      title: 'Unlock Pool',
      icon: faLockOpen,
      transform: 'grow-1',
      disabled: !isReady,
      small: true,
      onClick: () =>
        openModalWith(
          'ChangePoolState',
          { bondType: 'pool', state: PoolState.Open },
          'small'
        ),
    };

    if (!membership) {
      _label = 'Not in a Pool';
      _buttons = [createBtn];
    } else if (isOwner()) {
      _label = `Admin in Pool ${membership.poolId}`;
      switch (activeBondedPool?.state) {
        case PoolState.Open:
          _buttons = [destroyBtn, blockBtn];
          break;
        case PoolState.Block:
          _buttons = [destroyBtn, openBtn];
          break;
        default:
          _buttons = [];
      }
    } else if (active?.gt(0)) {
      _label = `Active in Pool ${membership.poolId}`;
      _buttons = [leaveBtn];
    } else {
      _label = `Leaving Pool ${membership.poolId}`;
    }
    return { label: _label, buttons: _buttons };
  })();

  const labelMembership = label;

  // Unclaimed rewards `Stat` props
  let { unclaimedReward } = activeBondedPool || {};
  unclaimedReward = unclaimedReward ?? new BN(0);

  const labelRewards = unclaimedReward.gt(new BN(0))
    ? `${formatBalance(unclaimedReward, {
        decimals: units,
        withSiFull: true,
        withUnit: unit,
      })}`
    : `0 ${unit}`;
  const buttonsRewards = unclaimedReward.toNumber()
    ? [
        {
          title: 'Claim',
          icon: faPaperPlane,
          disabled: !isReady,
          small: true,
          onClick: () =>
            openModalWith('ClaimReward', { bondType: 'pool' }, 'small'),
        },
      ]
    : undefined;
  return (
    <CardWrapper height="300">
      <Stat
        label="Membership"
        assistant={['pools', 'Pool Status']}
        stat={labelMembership}
        buttons={isSyncing ? [] : buttons}
      />
      <Separator />
      <Stat
        label="Unclaimed Rewards"
        assistant={['pools', 'Pool Rewards']}
        stat={labelRewards}
        buttons={isSyncing ? [] : buttonsRewards}
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
                : activeNominations
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
