// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createContext, useContext, useEffect, useState } from 'react';
import type { MaybeAddress } from 'types';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { rmCommas } from '@polkadot-cloud/utils';
import type {
  ChangeRateInput,
  CommissionFeature,
  OptionalCommissionFeature,
  PoolCommissionContextInterface,
  PoolCommissionProviderProps,
} from './types';
import { defaultPoolCommissionContext } from './defaults';

export const PoolCommissionContext =
  createContext<PoolCommissionContextInterface>(defaultPoolCommissionContext);

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
  const initialChangeRate = ((): ChangeRateInput => {
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
  const [changeRate, setChangeRate] =
    useState<ChangeRateInput>(initialChangeRate);

  // Whether max commission has been enabled.
  const [maxCommissionEnabled, setMaxCommissionEnabled] = useState<boolean>(
    hasValue('max_commission')
  );

  // Whether change rate has been enabled.
  const [changeRateEnabled, setChangeRateEnabled] = useState<boolean>(
    hasValue('change_rate')
  );

  // Reset all values to their initial (current) values.
  const resetAll = (): void => {
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

  // Get whether a feature has been updated from its initial value.
  const isUpdated = (feature: CommissionFeature): boolean => {
    switch (feature) {
      case 'commission':
        return commission !== initialCommission;

      case 'max_commission':
        return (
          // no value set and current value is initial.
          (!hasValue('max_commission') &&
            maxCommission === getInitial('max_commission')) ||
          // current value is not initial value.
          maxCommission !== getInitial('max_commission') ||
          // no value set and max commission is enabled.
          (!hasValue('max_commission') && getEnabled('max_commission'))
        );

      case 'change_rate':
        return (
          // no value set and current value equals initial.
          (!hasValue('change_rate') &&
            JSON.stringify(changeRate) ===
              JSON.stringify(getInitial('change_rate'))) ||
          // has value set and change rate is not initial.
          (hasValue('change_rate') &&
            JSON.stringify(changeRate) !==
              JSON.stringify(getInitial('change_rate'))) ||
          // no value set and change rate is enabled.
          (!hasValue('change_rate') && getEnabled('change_rate'))
        );

      default:
        return false;
    }
  };

  // Reset all values to their initial (current) values when bonded pool changes.
  useEffect(() => {
    resetAll();
  }, [bondedPool]);

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
        isUpdated,
        resetAll,
      }}
    >
      {children}
    </PoolCommissionContext.Provider>
  );
};
