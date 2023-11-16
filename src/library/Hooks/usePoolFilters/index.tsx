// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors

import { useTranslation } from 'react-i18next';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import type { BondedPool } from 'contexts/Pools/types';
import { useStaking } from 'contexts/Staking';
import type { AnyFunction, AnyJson } from 'types';

export const usePoolFilters = () => {
  const { t } = useTranslation('library');
  const { poolsNominations } = useBondedPools();
  const { getNominationsStatusFromTargets } = useStaking();
  const { getPoolNominationStatusCode } = useBondedPools();

  /*
   * Include active pools.
   * Returns the updated filtered list.
   */
  const includeActive = (list: any) => {
    if (!Object.keys(poolsNominations).length) return list;

    const filteredList = list.filter((p: BondedPool) => {
      const nominations = poolsNominations[p.id];
      const targets = nominations?.targets || [];
      const status = getPoolNominationStatusCode(
        getNominationsStatusFromTargets(p.addresses.stash, targets)
      );
      return status === 'active';
    });
    return filteredList;
  };

  /*
   * Dont include active pools.
   * Returns the updated filtered list.
   */
  const excludeActive = (list: any) => {
    if (!Object.keys(poolsNominations).length) return list;

    const filteredList = list.filter((p: BondedPool) => {
      const nominations = poolsNominations[p.id];
      const targets = nominations?.targets || [];
      const status = getPoolNominationStatusCode(
        getNominationsStatusFromTargets(p.addresses.stash, targets)
      );
      return status !== 'active';
    });
    return filteredList;
  };

  /*
   * include locked pools.
   * Iterates through the supplied list and checks whether state is locked.
   * Returns the updated filtered list.
   */
  const includeLocked = (list: any) =>
    list.filter((p: BondedPool) => p.state.toLowerCase() === 'Blocked');

  /*
   * include destroying pools.
   * Iterates through the supplied list and checks whether state is destroying.
   * Returns the updated filtered list.
   */
  const includeDestroying = (list: any) =>
    list.filter((p: BondedPool) => p.state === 'Destroying');

  /*
   * exclude locked pools.
   * Iterates through the supplied list and checks whether state is locked.
   * Returns the updated filtered list.
   */
  const excludeLocked = (list: any) =>
    list.filter((p: BondedPool) => p.state !== 'Blocked');

  /*
   * exclude destroying pools.
   * Iterates through the supplied list and checks whether state is destroying.
   * Returns the updated filtered list.
   */
  const excludeDestroying = (list: any) =>
    list.filter((p: BondedPool) => p.state !== 'Destroying');

  // includes to be listed in filter overlay.
  const includesToLabels: Record<string, string> = {
    active: t('activePools'),
  };

  // excludes to be listed in filter overlay.
  const excludesToLabels: Record<string, string> = {
    locked: t('lockedPools'),
    destroying: t('destroyingPools'),
  };

  // match include keys to their associated filter functions.
  const includeToFunction: Record<string, AnyFunction> = {
    active: includeActive,
    locked: includeLocked,
    destroying: includeDestroying,
  };

  // match exclude keys to their associated filter functions.
  const excludeToFunction: Record<string, AnyFunction> = {
    active: excludeActive,
    locked: excludeLocked,
    destroying: excludeDestroying,
  };

  // get filter functions from keys and type of filter.
  const getFiltersFromKey = (key: string[], type: string) => {
    const filters = type === 'include' ? includeToFunction : excludeToFunction;
    const fns = [];
    for (const k of key) {
      if (filters[k]) {
        fns.push(filters[k]);
      }
    }
    return fns;
  };

  // applies filters based on the provided include and exclude keys.
  const applyFilter = (
    includes: string[] | null,
    excludes: string[] | null,
    list: AnyJson
  ) => {
    if (!excludes && !includes) {
      return list;
    }
    if (includes) {
      for (const fn of getFiltersFromKey(includes, 'include')) {
        list = fn(list);
      }
    }
    if (excludes) {
      for (const fn of getFiltersFromKey(excludes, 'exclude')) {
        list = fn(list);
      }
    }
    return list;
  };

  return {
    includesToLabels,
    excludesToLabels,
    applyFilter,
  };
};
