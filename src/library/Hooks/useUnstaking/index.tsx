// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { useFastUnstake } from 'contexts/FastUnstake';
import { useNetworkMetrics } from 'contexts/NetworkMetrics';
import { useStaking } from 'contexts/Staking';
import { useTransferOptions } from 'contexts/TransferOptions';
import type { AnyJson } from 'types';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useNominationStatus } from '../useNominationStatus';

export const useUnstaking = () => {
  const { t } = useTranslation('library');
  const { consts } = useApi();
  const { inSetup } = useStaking();
  const { activeAccount } = useActiveAccounts();
  const { activeEra } = useNetworkMetrics();
  const { getTransferOptions } = useTransferOptions();
  const { getNominationStatus } = useNominationStatus();
  const { checking, head, isExposed, queueDeposit, meta } = useFastUnstake();
  const { bondDuration } = consts;
  const transferOptions = getTransferOptions(activeAccount).nominate;
  const { nominees } = getNominationStatus(activeAccount, 'nominator');

  // determine if user is regular unstaking
  const { active } = transferOptions;

  // determine if user is fast unstaking.
  const inHead =
    head?.stashes.find((s: AnyJson) => s[0] === activeAccount) ?? undefined;
  const inQueue = queueDeposit?.isGreaterThan(0) ?? false;

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
    isUnstaking: !inSetup() && !nominees.active.length && active.isZero(),
    isFastUnstaking: !!registered,
  };
};
