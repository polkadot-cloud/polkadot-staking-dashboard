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
import { planckBnToUnit, rmCommas } from 'Utils';
import {
  faLock,
  faExclamationTriangle,
  faPlus,
  faShare,
} from '@fortawesome/free-solid-svg-icons';
import { usePoolMemberships } from 'contexts/Pools/PoolMemberships';
import { useStaking } from 'contexts/Staking';
import { useValidators } from 'contexts/Validators';
import { useStatusButtons } from './useStatusButtons';
import { Membership } from './Membership';

export const Status = ({ height }: { height: number }) => {
  const { network, isReady } = useApi();
  const { activeAccount, isReadOnlyAccount } = useConnect();
  const { units, unit } = network;
  const { isSyncing } = useUi();
  const { membership } = usePoolMemberships();
  const { activeBondedPool, poolNominations } = useActivePool();
  const { openModalWith } = useModal();
  const { getNominationsStatusFromTargets, eraStakers } = useStaking();
  const { meta, validators } = useValidators();
  const { stakers } = eraStakers;
  const poolStash = activeBondedPool?.addresses?.stash || '';

  const nominationStatuses = getNominationsStatusFromTargets(
    poolStash,
    poolNominations?.targets ?? []
  );

  // determine pool state
  const poolState = activeBondedPool?.bondedPool?.state ?? null;

  const activeNominees = Object.entries(nominationStatuses)
    .map(([k, v]: any) => (v === 'active' ? k : false))
    .filter((v) => v !== false);

  const isNominating = !!poolNominations?.targets?.length;
  const inPool = membership;

  // Set the minimum unclaimed planck value to prevent e numbers
  const minUnclaimedDisplay = new BN(1_000_000);

  // Unclaimed rewards `Stat` props
  let { unclaimedRewards } = activeBondedPool || {};
  unclaimedRewards = unclaimedRewards ?? new BN(0);

  const labelRewards = unclaimedRewards.gt(minUnclaimedDisplay)
    ? `${planckBnToUnit(unclaimedRewards, units)} ${unit}`
    : `0 ${unit}`;

  const buttonsRewards = unclaimedRewards.gt(minUnclaimedDisplay)
    ? [
        {
          title: 'Withdraw',
          icon: faShare,
          disabled: !isReady || isReadOnlyAccount(activeAccount),
          small: true,
          onClick: () =>
            openModalWith('ClaimReward', { claimType: 'withdraw' }, 'small'),
        },
        {
          title: 'Bond',
          icon: faPlus,
          disabled:
            !isReady ||
            isReadOnlyAccount(activeAccount) ||
            poolState === PoolState.Destroy,
          small: true,
          onClick: () =>
            openModalWith('ClaimReward', { claimType: 'bond' }, 'small'),
        },
      ]
    : undefined;

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

  // check if rewards are being earned
  const stake = meta.validators_browse?.stake ?? [];
  const stakeSynced = stake.length > 0 ?? false;

  let earningRewards = false;
  if (stakeSynced) {
    for (const nominee of activeNominees) {
      const validator = validators.find((v: any) => v.address === nominee);
      if (validator) {
        const batchIndex = validators.indexOf(validator);
        const nomineeMeta = stake[batchIndex];
        const { lowestReward } = nomineeMeta;

        const validatorInEra =
          stakers.find((s: any) => s.address === nominee) || null;

        if (validatorInEra) {
          const { others } = validatorInEra;
          const stakedValue =
            others?.find((o: any) => o.who === poolStash)?.value ?? false;
          if (stakedValue) {
            const stakedValueBase = planckBnToUnit(
              new BN(rmCommas(stakedValue)),
              network.units
            );
            if (stakedValueBase >= lowestReward) {
              earningRewards = true;
              break;
            }
          }
        }
      }
    }
  }

  // determine pool status - left side
  const poolStatusLeft =
    poolState === PoolState.Block
      ? 'Locked / '
      : poolState === PoolState.Destroy
      ? 'Destroying / '
      : '';

  // determine pool status - right side
  const poolStatusRight = isSyncing
    ? 'Inactive: Pool Not Nominating'
    : !isNominating
    ? 'Inactive: Pool Not Nominating'
    : activeNominees.length
    ? `Nominating and ${
        earningRewards ? 'Earning Rewards' : 'Not Earning Rewards'
      }`
    : 'Waiting for Active Nominations';

  const { label, buttons } = useStatusButtons();

  return (
    <CardWrapper height={height}>
      {inPool ? (
        <Membership label={label} />
      ) : (
        <Stat
          label="Pool Membership"
          assistant={['pools', 'Pool Status']}
          stat="Not in Pool"
          buttons={isSyncing ? [] : buttons}
        />
      )}
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
