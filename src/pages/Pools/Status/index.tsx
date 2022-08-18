// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PoolState } from 'contexts/Pools/types';
import BN from 'bn.js';
import { useUi } from 'contexts/UI';
import { Separator } from 'Wrappers';
import { CardWrapper } from 'library/Graphs/Wrappers';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useActivePool } from 'contexts/Pools/ActivePool';
import { useModal } from 'contexts/Modal';
import { Stat } from 'library/Stat';
import { planckBnToUnit } from 'Utils';
import {
  faPaperPlane,
  faLock,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import { usePoolMemberships } from 'contexts/Pools/PoolMemberships';
import { useStatusButtons } from './useStatusButtons';

export const Status = ({ height }: { height: number }) => {
  const { network, isReady } = useApi();
  const { activeAccount, isReadOnlyAccount } = useConnect();
  const { units, unit } = network;
  const { isSyncing } = useUi();
  const { membership } = usePoolMemberships();
  const { activeBondedPool, poolNominations, getNominationsStatus } =
    useActivePool();
  const { openModalWith } = useModal();
  const nominationStatuses = getNominationsStatus();
  const activeNominations = Object.values(nominationStatuses).filter(
    (_v) => _v === 'active'
  ).length;
  const isNominating = !!poolNominations?.targets?.length;

  // Pool status `Stat` props
  const { label, buttons } = useStatusButtons();

  // Unclaimed rewards `Stat` props
  let { unclaimedReward } = activeBondedPool || {};
  unclaimedReward = unclaimedReward ?? new BN(0);
  const labelRewards = `${planckBnToUnit(unclaimedReward, units)} ${unit}`;

  const buttonsRewards = unclaimedReward.gtn(0)
    ? [
        {
          title: 'Claim',
          icon: faPaperPlane,
          disabled: !isReady || isReadOnlyAccount(activeAccount),
          small: true,
          onClick: () =>
            openModalWith('ClaimReward', { bondType: 'pool' }, 'small'),
        },
      ]
    : undefined;

  // determine pool state icon
  const poolState = activeBondedPool?.state ?? null;

  let poolStateIcon;
  switch (poolState) {
    case PoolState.Block:
      poolStateIcon = faLock;
      break;
    case PoolState.Destroy:
      poolStateIcon = faExclamationTriangle;
      break;
    default:
      poolStateIcon = undefined;
  }

  // determine pool status - left side
  const poolStatusLeft =
    poolState === PoolState.Block
      ? 'Blocked / '
      : poolState === PoolState.Destroy
      ? 'Destroying / '
      : '';

  // determine pool status - right side
  const poolStatusRight = isSyncing
    ? 'Inactive: Not Nominating'
    : !isNominating
    ? 'Inactive: Not Nominating'
    : activeNominations
    ? 'Actively Nominating with Pool Funds'
    : 'Waiting for Active Nominations';

  return (
    <CardWrapper height={height}>
      <Stat
        label="Membership"
        assistant={['pools', 'Pool Status']}
        stat={label}
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
            icon={isSyncing ? undefined : poolStateIcon}
            label="Pool Status"
            assistant={['stake', 'Staking Status']}
            stat={`${poolStatusLeft}${poolStatusRight}`}
          />
        </>
      )}
    </CardWrapper>
  );
};

export default Status;
