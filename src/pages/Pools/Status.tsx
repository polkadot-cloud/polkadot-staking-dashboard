// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { APIContextInterface } from 'types/api';
import { ConnectContextInterface } from 'types/connect';
import BN from 'bn.js';
import { formatBalance } from '@polkadot/util';
import { useStaking } from 'contexts/Staking';
import { useUi } from 'contexts/UI';
import { Separator } from 'Wrappers';
import { CardWrapper } from 'library/Graphs/Wrappers';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { usePools } from 'contexts/Pools';
import { useModal } from 'contexts/Modal';
import { Stat } from 'library/Stat';

import {
  faChevronCircleRight,
  faPaperPlane,
  faSignOutAlt,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';

export const Status = () => {
  const { network, isReady } = useApi() as APIContextInterface;
  const { activeAccount } = useConnect() as ConnectContextInterface;
  const { units, unit } = network;
  const { isSyncing } = useUi();
  const {
    membership,
    activeBondedPool,
    poolNominations,
    isOwner,
    getNominationsStatus,
    getPoolBondOptions,
  } = usePools();

  const { openModalWith } = useModal();
  const { active } = getPoolBondOptions(activeAccount);

  // get nomination status
  const nominationStatuses = getNominationsStatus();

  const activeNominations: any = Object.values(nominationStatuses).filter(
    (_v: any) => _v === 'active'
  ).length;

  const isNominating = !!poolNominations?.targets?.length;

  // Pool status `Stat` props
  const { label, buttons } = (() => {
    let _label;
    let _buttons;
    if (!membership) {
      _label = 'Not in a Pool';
      _buttons = [
        {
          title: 'Create Pool',
          icon: faChevronCircleRight,
          transform: 'grow-1',
          disabled: !isReady,
          onClick: () =>
            openModalWith('CreatePool', { target: 'pool' }, 'small'),
        },
      ];
    } else if (isOwner()) {
      _label = `Admin in Pool ${membership.poolId}`;
      _buttons = [
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
    } else if (active?.gt(0)) {
      _label = `Active in Pool ${membership.poolId}`;
      _buttons = [
        {
          title: 'Leave Pool',
          icon: faSignOutAlt,
          disabled: !isReady,
          small: true,
          onClick: () =>
            openModalWith('LeavePool', { target: 'pool' }, 'small'),
        },
      ];
    } else {
      _label = `Leaving Pool ${membership.poolId}`;
    }
    return { label: _label, buttons: _buttons };
  })();

  const labelMembership = label;
  // fallback to no buttons if app is syncing
  const buttonsMembership = isSyncing ? [] : buttons;

  // Unclaimed rewards `Stat` props
  let { unclaimedReward } = activeBondedPool || {};
  unclaimedReward = unclaimedReward ?? new BN(0);

  const labelRewards = unclaimedReward
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
