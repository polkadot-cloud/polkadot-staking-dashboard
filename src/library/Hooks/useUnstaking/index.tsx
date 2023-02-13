// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BigNumber from 'bignumber.js';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useFastUnstake } from 'contexts/FastUnstake';
import { useNetworkMetrics } from 'contexts/Network';
import { useStaking } from 'contexts/Staking';
import { useTransferOptions } from 'contexts/TransferOptions';
import { useTranslation } from 'react-i18next';
import { AnyJson } from 'types';

export const useUnstaking = () => {
  const { t } = useTranslation('library');
  const { consts } = useApi();
  const { getTransferOptions } = useTransferOptions();
  const { activeAccount } = useConnect();
  const { getNominationsStatus, inSetup } = useStaking();
  const { activeEra } = useNetworkMetrics();
  const { checking, head, isExposed, queueDeposit, meta } = useFastUnstake();
  const { bondDuration } = consts;
  const transferOptions = getTransferOptions(activeAccount).nominate;
  const nominationStatuses = getNominationsStatus();

  // determine if user is regular unstaking
  const { active } = transferOptions;
  const activeNominations = Object.entries(nominationStatuses)
    .map(([k, v]: any) => (v === 'active' ? k : false))
    .filter((v) => v !== false);

  // determine if user is fast unstaking.
  const inHead =
    head?.stashes.find((s: AnyJson) => s[0] === activeAccount) ?? undefined;
  const inQueue = queueDeposit?.isGreaterThan(new BigNumber(0)) ?? false;

  const registered = inHead || inQueue;

  // determine unstake button
  const getFastUnstakeText = () => {
    const { checked } = meta;
    if (checking) {
      return `${t('fastUnstakeCheckingEras', {
        checked: checked.length,
        total: bondDuration.toString(),
      })}...`;
    }
    if (isExposed) {
      const lastExposed = activeEra.index.minus(checked[0] || 0);
      return t('fastUnstakeExposed', {
        count: lastExposed.toNumber(),
      });
    }
    if (registered) {
      return t('inQueue');
    }
    return t('fastUnstake');
  };

  return {
    getFastUnstakeText,
    isUnstaking: !inSetup() && !activeNominations.length && active.isZero(),
    isFastUnstaking: !!registered,
  };
};
