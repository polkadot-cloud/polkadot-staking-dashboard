// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createContext, useContext, useState } from 'react';
import type { MaybeAddress } from 'types';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { rmCommas } from '@polkadot-cloud/utils';
import type {
  CommissionFeature,
  OptionalCommissionFeature,
  PoolCommissionContextInterface,
  PoolCommissionProviderProps,
} from './types';

export const PoolCommissionContext =
  createContext<PoolCommissionContextInterface>(null);

export const usePoolCommission = () => useContext(PoolCommissionContext);

export const PoolCommissionProvider = ({
  children,
}: PoolCommissionProviderProps) => {
  const { getBondedPool } = useBondedPools();
  const { selectedActivePool } = useActivePools();
  const poolId = selectedActivePool?.id || 0;
  const bondedPool = getBondedPool(poolId);

  // Get initial commission value from the bonded pool commission config.
  const initialCommission = Number(
    (bondedPool?.commission?.current?.[0] || '0%').slice(0, -1)
  );

  // Get initial payee value from the bonded pool commission config.
  const initialPayee = bondedPool?.commission?.current?.[1] || null;

  // Get initial maximum commission value from the bonded pool commission config.
  const initialMaxCommission = Number(
    (bondedPool?.commission?.max || '100%').slice(0, -1)
  );

  // Get initial change rate value from the bonded pool commission config.
  const initialChangeRate = (() => {
    const raw = bondedPool?.commission?.changeRate;
    return raw
      ? {
          maxIncrease: Number(raw.maxIncrease.slice(0, -1)),
          minDelay: Number(rmCommas(raw.minDelay)),
        }
      : {
          maxIncrease: 100,
          minDelay: 0,
        };
  })();

  // Get whether a commission feature has been set.
  const hasValue = (feature: OptionalCommissionFeature): boolean => {
    switch (feature) {
      case 'max_commission':
        return !!bondedPool?.commission?.max;
      case 'change_rate':
        return !!bondedPool?.commission?.changeRate;
      default:
        return false;
    }
  };

  // Store the commission payee.
  const [payee, setPayee] = useState<MaybeAddress>(initialPayee);

  // Store the current commission value.
  const [commission, setCommission] = useState<number>(initialCommission);

  // Store the maximum commission value.
  const [maxCommission, setMaxCommission] =
    useState<number>(initialMaxCommission);

  // Store the commission change rate value.
  const [changeRate, setChangeRate] = useState<{
    maxIncrease: number;
    minDelay: number;
  }>(initialChangeRate);

  // Whether max commission has been enabled.
  const [maxCommissionEnabled, setMaxCommissionEnabled] = useState<boolean>(
    hasValue('max_commission')
  );

  // Whether change rate has been enabled.
  const [changeRateEnabled, setChangeRateEnabled] = useState<boolean>(
    hasValue('change_rate')
  );

  // Reset all values to their initial (current) values.
  const resetAll = () => {
    setCommission(initialCommission);
    setPayee(initialPayee);
    setMaxCommission(initialMaxCommission);
  };

  // Get the initial value of a commission feature.
  const getInitial = (feature: CommissionFeature) => {
    switch (feature) {
      case 'commission':
        return initialCommission;
      case 'payee':
        return initialPayee;
      case 'max_commission':
        return initialMaxCommission;
      case 'change_rate':
        return initialChangeRate;
      default:
        return false;
    }
  };

  // Get the current value of a commission feayture.
  const getCurrent = (feature: CommissionFeature) => {
    switch (feature) {
      case 'commission':
        return commission;
      case 'payee':
        return payee;
      case 'max_commission':
        return maxCommission;
      case 'change_rate':
        return changeRate;
      default:
        return false;
    }
  };

  // Get whether a commission feature is enabled.
  const getEnabled = (feature: OptionalCommissionFeature): boolean => {
    switch (feature) {
      case 'max_commission':
        return maxCommissionEnabled;
      case 'change_rate':
        return changeRateEnabled;
      default:
        return false;
    }
  };

  // Set whether a commission feature is enabled.
  const setEnabled = (
    feature: OptionalCommissionFeature,
    enabled: boolean
  ): void => {
    switch (feature) {
      case 'max_commission':
        setMaxCommissionEnabled(enabled);
        break;
      case 'change_rate':
        setChangeRateEnabled(enabled);
        break;
      default:
    }
  };

  return (
    <PoolCommissionContext.Provider
      value={{
        setCommission,
        setPayee,
        setMaxCommission,
        setChangeRate,
        getInitial,
        getCurrent,
        getEnabled,
        setEnabled,
        hasValue,
        resetAll,
      }}
    >
      {children}
    </PoolCommissionContext.Provider>
  );
};
