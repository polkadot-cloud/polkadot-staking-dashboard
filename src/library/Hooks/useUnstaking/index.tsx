// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BN } from 'bn.js';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useFastUnstake } from 'contexts/FastUnstake';
import { useNetworkMetrics } from 'contexts/Network';
import { useStaking } from 'contexts/Staking';
import { useTransferOptions } from 'contexts/TransferOptions';
import { AnyJson } from 'types';

export const useUnstaking = () => {
  const { consts } = useApi();
  const { getTransferOptions } = useTransferOptions();
  const { activeAccount } = useConnect();
  const { getNominationsStatus } = useStaking();
  const { metrics } = useNetworkMetrics();
  const { checking, head, isExposed, queueDeposit, meta } = useFastUnstake();
  const { bondDuration } = consts;
  const transferOptions = getTransferOptions(activeAccount).nominate;
  const nominationStatuses = getNominationsStatus();
  const { activeEra } = metrics;

  // determine if user is regular unstaking
  const { active } = transferOptions;
  const activeNominations = Object.entries(nominationStatuses)
    .map(([k, v]: any) => (v === 'active' ? k : false))
    .filter((v) => v !== false);

  // determine if user is fast unstaking.
  const inHead =
    head?.stashes.find((s: AnyJson) => s[0] === activeAccount) ?? undefined;
  const inQueue = queueDeposit?.gt(new BN(0)) ?? false;

  const registered = inHead || inQueue;

  // determine unstake button
  const getFastUnstakeText = () => {
    const { checked } = meta;
    if (checking) {
      return `Checking ${checked.length} of ${bondDuration} eras...`;
    }
    if (isExposed) {
      const lastExposed = activeEra.index - (checked[0] || 0);
      return `Exposed ${lastExposed} Era${lastExposed !== 1 ? `s` : ``} Ago`;
    }
    if (registered) {
      return 'In Queue';
    }
    return 'Fast Unstake';
  };

  return {
    getFastUnstakeText,
    isUnstaking: !activeNominations.length && active.isZero(),
    isFastUnstaking: !!registered,
  };
};

export default useUnstaking;
