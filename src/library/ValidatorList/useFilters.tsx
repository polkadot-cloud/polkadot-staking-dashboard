// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import { useValidators } from 'contexts/Validators';

export const useFilters = () => {
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

  const getFiltersToApply = (excludes: Array<string>) => {
    const fnsToApply = [];
    if (excludes.includes('missing_identity')) {
      fnsToApply.push(filterMissingIdentity);
    }
    if (excludes.includes('over_subscribed')) {
      fnsToApply.push(filterOverSubscribed);
    }
    if (excludes.includes('all_commission')) {
      fnsToApply.push(filterAllCommission);
    }
    if (excludes.includes('blocked_nominations')) {
      fnsToApply.push(filterBlockedNominations);
    }

    if (excludes.includes('inactive')) {
      fnsToApply.push(filterInactive);
    }
    if (excludes.includes('not_parachain_validator')) {
      fnsToApply.push(filterNonParachainValidator);
    }
    if (excludes.includes('in_session')) {
      fnsToApply.push(filterInSession);
    }
  };

  return {
    filters: getFiltersToApply,
  };
};
