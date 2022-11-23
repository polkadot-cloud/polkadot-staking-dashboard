// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { u8aToString, u8aUnwrapBytes } from '@polkadot/util';
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

  const filtersToLabels: { [key: string]: string } = {
    inactive: 'Inactive Validators',
    over_subscribed: 'Over Subscribed',
    all_commission: '100% Commission',
    blocked_nominations: 'Blocked Nominations',
    missing_identity: 'Missing Identity',
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
   * Orders a list by commission, lowest first.
   * Returns the updated ordered list.
   */
  const orderLowestCommission = (list: any) => {
    return [...list].sort(
      (a: any, b: any) => a.prefs.commission - b.prefs.commission
    );
  };

  /*
   * orderHighestCommission
   * Orders a list by commission, highest first.
   * Returns the updated ordered list.
   */
  const orderHighestCommission = (list: any) => {
    return [...list].sort(
      (a: any, b: any) => b.prefs.commission - a.prefs.commission
    );
  };

  const ordersToLabels: { [key: string]: string } = {
    default: 'Unordered',
    low_commission: 'Low Commission',
    high_commission: 'High Commission',
  };

  const orderToFunction: { [key: string]: AnyFunction } = {
    low_commission: orderLowestCommission,
    high_commission: orderHighestCommission,
  };

  const applyOrder = (o: string, list: AnyJson) => {
    const fn = orderToFunction[o];
    if (fn) {
      return fn(list);
    }
    return list;
  };

  /*
   * applySearch
   * Iterates through the supplied list and refers to the meta
   * batch of the list to filter those list items that match
   * the search term.
   * Returns the updated filtered list.
   */
  const applySearch = (list: any, batchKey: string, searchTerm: string) => {
    if (meta[batchKey] === undefined) return list;
    const filteredList: any = [];
    for (const validator of list) {
      const batchIndex =
        meta[batchKey].addresses?.indexOf(validator.address) ?? -1;
      const identities = meta[batchKey]?.identities ?? false;
      const supers = meta[batchKey]?.supers ?? false;

      // if we cannot derive data, fallback to include validator in filtered list
      if (batchIndex === -1 || !identities || !supers) {
        filteredList.push(validator);
        continue;
      }

      const address = meta[batchKey].addresses[batchIndex];

      const identity = identities[batchIndex] ?? '';
      const identityRaw = identity?.info?.display?.Raw ?? '';
      const identityAsBytes = u8aToString(u8aUnwrapBytes(identityRaw));
      const identitySearch = (
        identityAsBytes === '' ? identityRaw : identityAsBytes
      ).toLowerCase();

      const superIdentity = supers[batchIndex] ?? null;
      const superIdentityRaw =
        superIdentity?.identity?.info?.display?.Raw ?? '';
      const superIdentityAsBytes = u8aToString(
        u8aUnwrapBytes(superIdentityRaw)
      );
      const superIdentitySearch = (
        superIdentityAsBytes === '' ? superIdentityRaw : superIdentityAsBytes
      ).toLowerCase();

      if (address.toLowerCase().includes(searchTerm.toLowerCase()))
        filteredList.push(validator);
      if (
        identitySearch.includes(searchTerm.toLowerCase()) ||
        superIdentitySearch.includes(searchTerm.toLowerCase())
      )
        filteredList.push(validator);
    }
    return filteredList;
  };

  return {
    filtersToLabels,
    ordersToLabels,
    filter,
    applyOrder,
    applySearch,
  };
};
