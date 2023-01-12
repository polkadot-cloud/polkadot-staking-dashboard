// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors

import { useBondedPools } from 'contexts/Pools/BondedPools';
import { BondedPool } from 'contexts/Pools/types';
import { useStaking } from 'contexts/Staking';
import { useTranslation } from 'react-i18next';
import { AnyFunction, AnyJson } from 'types';

export const usePoolFilters = () => {
  const { meta } = useBondedPools();
  const { getNominationsStatusFromTargets } = useStaking();
  const { getPoolNominationStatusCode } = useBondedPools();
  const { t } = useTranslation('library');

  /*
   * include active pools.
   * Iterates through the supplied list and refers to the meta
   * batch of the list to filter those list items that are
   * actively nominating.
   * Returns the updated filtered list.
   */
  const includeActive = (list: any, batchKey: string) => {
    // get pool targets from nominations meta batch
    const nominations = meta[batchKey]?.nominations ?? [];
    if (!nominations) {
      return list;
    }
    let i = -1;
    const filteredList = list.filter((p: BondedPool) => {
      i++;
      const targets = nominations[i]?.targets ?? [];
      const status = getPoolNominationStatusCode(
        getNominationsStatusFromTargets(p.addresses.stash, targets)
      );
      return status === 'active';
    });
    return filteredList;
  };

  /*
   * dont include active pools.
   * Iterates through the supplied list and refers to the meta
   * batch of the list to filter those list items that are
   * actively nominating.
   * Returns the updated filtered list.
   */
  const excludeActive = (list: any, batchKey: string) => {
    // get pool targets from nominations meta batch
    const nominations = meta[batchKey]?.nominations ?? [];
    if (!nominations) {
      return list;
    }
    let i = -1;
    const filteredList = list.filter((p: BondedPool) => {
      i++;
      const targets = nominations[i]?.targets ?? [];
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
  const includeLocked = (list: any) => {
    return list.filter((p: BondedPool) => p.state.toLowerCase() === 'blocked');
  };

  /*
   * include destroying pools.
   * Iterates through the supplied list and checks whether state is destroying.
   * Returns the updated filtered list.
   */
  const includeDestroying = (list: any) => {
    return list.filter(
      (p: BondedPool) => p.state.toLowerCase() === 'destroying'
    );
  };

  /*
   * exclude locked pools.
   * Iterates through the supplied list and checks whether state is locked.
   * Returns the updated filtered list.
   */
  const excludeLocked = (list: any) => {
    return list.filter((p: BondedPool) => p.state.toLowerCase() !== 'blocked');
  };

  /*
   * exclude destroying pools.
   * Iterates through the supplied list and checks whether state is destroying.
   * Returns the updated filtered list.
   */
  const excludeDestroying = (list: any) => {
    return list.filter(
      (p: BondedPool) => p.state.toLowerCase() !== 'destroying'
    );
  };

  // includes to be listed in filter overlay.
  const includesToLabels: { [key: string]: string } = {
    active: t('activePools'),
  };

  // excludes to be listed in filter overlay.
  const excludesToLabels: { [key: string]: string } = {
    locked: t('lockedPools'),
    destroying: t('destroyingPools'),
  };

  // match include keys to their associated filter functions.
  const includeToFunction: { [key: string]: AnyFunction } = {
    active: includeActive,
    locked: includeLocked,
    destroying: includeDestroying,
  };

  // match exclude keys to their associated filter functions.
  const excludeToFunction: { [key: string]: AnyFunction } = {
    active: excludeActive,
    locked: excludeLocked,
    destroying: excludeDestroying,
  };

  // get filter functions from keys and type of filter.
  const getFiltersFromKey = (key: Array<string>, type: string) => {
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
    includes: Array<string> | null,
    excludes: Array<string> | null,
    list: AnyJson,
    batchKey: string
  ) => {
    if (!excludes && !includes) {
      return list;
    }
    if (includes) {
      for (const fn of getFiltersFromKey(includes, 'include')) {
        list = fn(list, batchKey);
      }
    }
    if (excludes) {
      for (const fn of getFiltersFromKey(excludes, 'exclude')) {
        list = fn(list, batchKey);
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
