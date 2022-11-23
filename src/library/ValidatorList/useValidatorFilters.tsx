// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import { useValidators } from 'contexts/Validators';
import { AnyFunction, AnyJson } from 'types';

export const useValidatorFilters = () => {
  const { consts } = useApi();
  const { meta, session, sessionParachain } = useValidators();
  const { maxNominatorRewardedPerValidator } = consts;

  /*
   * filterMissingIdentity
   * Iterates through the supplied list and refers to the meta
   * batch of the list to filter those list items with
   * missing identities.
   * Returns the updated filtered list.
   */
  const filterMissingIdentity = (list: any, batchKey: string) => {
    if (meta[batchKey] === undefined) {
      return list;
    }
    const filteredList: any = [];
    for (const validator of list) {
      const addressBatchIndex =
        meta[batchKey].addresses?.indexOf(validator.address) ?? -1;

      // if we cannot derive data, fallback to include validator in filtered list
      if (addressBatchIndex === -1) {
        filteredList.push(validator);
        continue;
      }

      const identities = meta[batchKey]?.identities ?? [];
      const supers = meta[batchKey]?.supers ?? [];

      // push validator if sync has not completed
      if (!identities.length || !supers.length) {
        filteredList.push(validator);
      }

      const identityExists = identities[addressBatchIndex] ?? null;
      const superExists = supers[addressBatchIndex] ?? null;

      // validator included if identity or super identity has been set
      if (identityExists !== null || superExists !== null) {
        filteredList.push(validator);
        continue;
      }
    }
    return filteredList;
  };

  /*
   * filterOverSubscribed
   * Iterates through the supplied list and refers to the meta
   * batch of the list to filter those list items that are
   * over subscribed.
   * Returns the updated filtered list.
   */
  const filterOverSubscribed = (list: any, batchKey: string) => {
    if (meta[batchKey] === undefined) {
      return list;
    }
    const filteredList: any = [];
    for (const validator of list) {
      const addressBatchIndex =
        meta[batchKey].addresses?.indexOf(validator.address) ?? -1;
      const stake = meta[batchKey]?.stake ?? false;

      // if we cannot derive data, fallback to include validator in filtered list
      if (addressBatchIndex === -1 || !stake) {
        filteredList.push(validator);
        continue;
      }
      const totalNominations = stake[addressBatchIndex].total_nominations ?? 0;
      if (totalNominations < maxNominatorRewardedPerValidator) {
        filteredList.push(validator);
        continue;
      }
    }
    return filteredList;
  };

  /*
   * filterAllCommission
   * Filters the supplied list and removes items with 100% commission.
   * Returns the updated filtered list.
   */
  const filterAllCommission = (list: any) => {
    list = list.filter(
      (validator: any) => validator?.prefs?.commission !== 100
    );
    return list;
  };

  /*
   * filterBlockedNominations
   * Filters the supplied list and removes items that have blocked nominations.
   * Returns the updated filtered list.
   */
  const filterBlockedNominations = (list: any) => {
    return list.filter((validator: any) => validator?.prefs?.blocked !== true);
  };

  /*
   * filterInactive
   * Filters the supplied list and removes items that are inactive.
   * Returns the updated filtered list.
   */
  const filterInactive = (list: any) => {
    // if list has not yet been populated, return original list
    if (session.list.length === 0) return list;
    return list.filter((validator: any) =>
      session.list.includes(validator.address)
    );
  };

  /*
   * filterNonParachainValidator
   * Filters the supplied list and removes items that are inactive.
   * Returns the updated filtered list.
   */
  const filterNonParachainValidator = (list: any) => {
    // if list has not yet been populated, return original list
    if ((sessionParachain?.length ?? 0) === 0) return list;
    return list.filter((validator: any) =>
      sessionParachain.includes(validator.address)
    );
  };

  /*
   * filterInSession
   * Filters the supplied list and removes items that are in the current session.
   * Returns the updated filtered list.
   */
  const filterInSession = (list: any) => {
    // if list has not yet been populated, return original list
    if (session.list.length === 0) return list;
    return list.filter(
      (validator: any) => !session.list.includes(validator.address)
    );
  };

  const filterToFunction: { [key: string]: AnyFunction } = {
    missing_identity: filterMissingIdentity,
    over_subscribed: filterOverSubscribed,
    all_commission: filterAllCommission,
    blocked_nominations: filterBlockedNominations,
    inactive: filterInactive,
    not_parachain_validator: filterNonParachainValidator,
    in_session: filterInSession,
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

  const filter = (
    excludes: Array<string> | null,
    list: AnyJson,
    batchKey: string
  ) => {
    if (!excludes) {
      return list;
    }
    for (const fn of getFiltersToApply(excludes)) {
      list = fn(list, batchKey);
    }
    return list;
  };

  /*
   * orderLowestCommission
   * Orders a list by commission.
   * Returns the updated ordered list.
   */
  const orderLowestCommission = (list: any) => {
    return [...list].sort(
      (a: any, b: any) => a.prefs.commission - b.prefs.commission
    );
  };

  const applyOrder = (o: string, list: AnyJson) => {
    return o === 'commission' ? orderLowestCommission(list) : list;
  };

  return {
    filter,
    applyOrder,
  };
};
