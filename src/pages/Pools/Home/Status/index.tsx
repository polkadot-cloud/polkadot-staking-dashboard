// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  faExclamationTriangle,
  faLock,
  faPlus,
  faShare,
} from '@fortawesome/free-solid-svg-icons';
import BN from 'bn.js';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { PoolState } from 'contexts/Pools/types';
import { useStaking } from 'contexts/Staking';
import { useUi } from 'contexts/UI';
import { useValidators } from 'contexts/Validators';
import { CardWrapper } from 'library/Graphs/Wrappers';
import { Stat } from 'library/Stat';
import { planckBnToUnit, rmCommas } from 'Utils';
import { Separator } from 'Wrappers';
import { Membership } from './Membership';
import { useStatusButtons } from './useStatusButtons';

export const Status = ({ height }: { height: number }) => {
  const { network, isReady } = useApi();
  const { activeAccount, isReadOnlyAccount } = useConnect();
  const { units, unit } = network;
  const { isSyncing } = useUi();
  const { selectedActivePool, poolNominations } = useActivePools();
  const { openModalWith } = useModal();
  const { getNominationsStatusFromTargets, eraStakers } = useStaking();
  const { meta, validators } = useValidators();
  const { stakers } = eraStakers;
  const poolStash = selectedActivePool?.addresses?.stash || '';

  const nominationStatuses = getNominationsStatusFromTargets(
    poolStash,
    poolNominations?.targets ?? []
  );

  // determine pool state
  const poolState = selectedActivePool?.bondedPool?.state ?? null;

  const activeNominees = Object.entries(nominationStatuses)
    .map(([k, v]: any) => (v === 'active' ? k : false))
    .filter((v) => v !== false);

  const isNominating = !!poolNominations?.targets?.length;

  // Set the minimum unclaimed planck value to prevent e numbers
  const minUnclaimedDisplay = new BN(1_000_000);

  // Unclaimed rewards `Stat` props
  let { unclaimedRewards } = selectedActivePool || {};
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
      {selectedActivePool ? (
        <Membership label={label} />
      ) : (
        <Stat
          label="Pool Membership"
          helpKey="Pool Membership"
          stat="Not in Pool"
          buttons={isSyncing ? [] : buttons}
        />
      )}
      <Separator />
      <Stat
        label="Unclaimed Rewards"
        helpKey="Pool Rewards"
        stat={labelRewards}
        buttons={isSyncing ? [] : buttonsRewards}
      />
      {selectedActivePool && (
        <>
          <Separator />
          <Stat
            icon={isSyncing ? undefined : poolStateIcon}
            label="Pool Status"
            helpKey="Nomination Status"
            stat={`${poolStatusLeft}${poolStatusRight}`}
          />
        </>
      )}
    </CardWrapper>
  );
};

export default Status;
