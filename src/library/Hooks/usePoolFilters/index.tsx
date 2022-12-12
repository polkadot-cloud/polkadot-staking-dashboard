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
   * filterActive
   * Iterates through the supplied list and refers to the meta
   * batch of the list to filter those list items that are
   * actively nominating.
   * Returns the updated filtered list.
   */
  const filterActive = (list: any, batchKey: string) => {
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
   * filterLocked
   * Iterates through the supplied list and refers to the meta
   * batch of the list to filter those list items that are
   * locked.
   * Returns the updated filtered list.
   */
  const filterLocked = (list: any) => {
    return list.filter((p: BondedPool) => p.state !== 'Blocked');
  };

  /*
   * filterDestroying
   * Iterates through the supplied list and refers to the meta
   * batch of the list to filter those list items that are
   * being destroyed.
   * Returns the updated filtered list.
   */
  const filterDestroying = (list: any) => {
    return list.filter((p: BondedPool) => p.state !== 'Destroying');
  };

  const includesToLabels: { [key: string]: string } = {
    active: t('activePools'),
  };

  const excludesToLabels: { [key: string]: string } = {
    locked: t('lockedPools'),
    destroying: t('destroyingPools'),
  };

  const filterToFunction: { [key: string]: AnyFunction } = {
    active: filterActive,
    locked: filterLocked,
    destroying: filterDestroying,
  };

  const getFiltersToApply = (excludes: Array<string>) => {
    const fns = [];
    for (const exclude of excludes) {
      if (filterToFunction[exclude]) {
        fns.push(filterToFunction[exclude]);
      }
    }
    return fns;
  };

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
      for (const fn of getFiltersToApply(includes)) {
        list = fn(list, batchKey);
      }
    }
    if (excludes) {
      for (const fn of getFiltersToApply(excludes)) {
        list = fn(list, batchKey);
      }
    }
    return list;
  };

  return {
    filterToFunction,
    includesToLabels,
    excludesToLabels,
    applyFilter,
  };
};
