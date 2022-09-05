// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import { useValidators } from 'contexts/Validators';
import React, { useState } from 'react';
import { u8aToString, u8aUnwrapBytes } from '@polkadot/util';
import * as defaults from './defaults';
import { ValidatorFilterContextInterface } from './types';

// Note: This context should wrap both the filter component and UI in question for displaying the filtered list.
export const ValidatorFilterContext =
  React.createContext<ValidatorFilterContextInterface>(defaults.defaultContext);

export const useValidatorFilter = () =>
  React.useContext(ValidatorFilterContext);

export const ValidatorFilterProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { consts } = useApi();
  const { meta, session } = useValidators();
  const { maxNominatorRewardedPerValidator } = consts;

  // store validator filters that are currently active
  const [validatorFilters, setValidatorFilters]: any = useState([]);

  // store the validator ordering method that is currently active
  const [validatorOrder, setValidatorOrder]: any = useState('default');

  const setValidatorsOrder = (by: string) => {
    setValidatorOrder(by);
  };

  const setValidatorsFilter = (filter: any) => {
    setValidatorFilters(filter);
  };

  /*
   * toggleAllValidaorFilters
   * Either turns all filters on or all filters off.
   */
  const toggleAllValidatorFilters = (toggle: number) => {
    if (toggle) {
      setValidatorsFilter([
        'all_commission',
        'blocked_nominations',
        'over_subscribed',
        'missing_identity',
        'inactive',
      ]);
    } else {
      setValidatorFilters([]);
    }
  };

  /*
   * toggleFilterValidators
   * Toggles a validator filter. If the filer is currently active,
   * it is removed. State updates accordingly.
   */
  const toggleFilterValidators = (f: string) => {
    const filter = [...validatorFilters];
    const action = filter.includes(f) ? 'remove' : 'push';

    if (action === 'remove') {
      const index = filter.indexOf(f);
      filter.splice(index, 1);
    } else {
      filter.push(f);
    }
    setValidatorsFilter(filter);
  };

  /*
   * applyValidatorFilters
   * Takes a list, batchKey and which filter should be applied
   * to the data. The filter function in question is called,
   * that is dependent on the filter key.
   * The updated filtered list is returned.
   *
   */
  const applyValidatorFilters = (
    list: any,
    batchKey: string,
    filter: any = validatorFilters
  ) => {
    if (filter.includes('all_commission')) {
      list = filterAllCommission(list);
    }
    if (filter.includes('blocked_nominations')) {
      list = filterBlockedNominations(list);
    }
    if (filter.includes('over_subscribed')) {
      list = filterOverSubscribed(list, batchKey);
    }
    if (filter.includes('missing_identity')) {
      list = filterMissingIdentity(list, batchKey);
    }
    if (filter.includes('inactive')) {
      list = filterInactive(list);
    }
    return list;
  };

  /*
   * resetValidatorFilters
   * Resets filters and ordering to the default state.
   */
  const resetValidatorFilters = () => {
    setValidatorFilters([]);
    setValidatorOrder('default');
  };

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

      // if we cannot derive data, fallback to include validator in filtered list
      if (addressBatchIndex === -1) {
        filteredList.push(validator);
        continue;
      }
      const stake = meta[batchKey]?.stake ?? false;
      if (!stake) {
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
    list = list.filter((validator: any) => validator?.prefs?.blocked !== true);
    return list;
  };

  /*
   * filterInactive
   * Filters the supplied list and removes items that are inactive.
   * Returns the updated filtered list.
   */
  const filterInactive = (list: any) => {
    // if list has not yet been populated, return original list
    if (session.list.length === 0) {
      return list;
    }
    list = list.filter((validator: any) =>
      session.list.includes(validator.address)
    );
    return list;
  };

  /*
   * orderValidators
   * Sets the ordering key for orderValidators
   */
  const orderValidators = (by: string) => {
    const order = validatorOrder === by ? 'default' : by;
    setValidatorsOrder(order);
  };

  /*
   * orderValidators
   * Applies an ordering function to the validator list.
   * Returns the updated ordered list.
   */
  const applyValidatorOrder = (list: any, order: string) => {
    if (order === 'commission') {
      return orderLowestCommission(list);
    }
    return list;
  };

  /*
   * orderLowestCommission
   * Orders a list by commission.
   * Returns the updated ordered list.
   */
  const orderLowestCommission = (list: any) => {
    const orderedList = [...list].sort(
      (a: any, b: any) => a.prefs.commission - b.prefs.commission
    );
    return orderedList;
  };

  /*
   * validatorSearchFilter
   * Iterates through the supplied list and refers to the meta
   * batch of the list to filter those list items that match
   * the search term.
   * Returns the updated filtered list.
   */
  const validatorSearchFilter = (
    list: any,
    batchKey: string,
    searchTerm: string
  ) => {
    if (meta[batchKey] === undefined) {
      return list;
    }
    const filteredList: any = [];
    for (const validator of list) {
      const batchIndex =
        meta[batchKey].addresses?.indexOf(validator.address) ?? -1;

      // if we cannot derive data, fallback to include validator in filtered list
      if (batchIndex === -1) {
        filteredList.push(validator);
        continue;
      }
      const identities = meta[batchKey]?.identities ?? false;
      if (!identities) {
        filteredList.push(validator);
        continue;
      }
      const supers = meta[batchKey]?.supers ?? false;
      if (!supers) {
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

      if (address.toLowerCase().includes(searchTerm.toLowerCase())) {
        filteredList.push(validator);
      }
      if (
        identitySearch.includes(searchTerm.toLowerCase()) ||
        superIdentitySearch.includes(searchTerm.toLowerCase())
      ) {
        filteredList.push(validator);
      }
    }
    return filteredList;
  };

  return (
    <ValidatorFilterContext.Provider
      value={{
        orderValidators,
        applyValidatorOrder,
        applyValidatorFilters,
        resetValidatorFilters,
        toggleFilterValidators,
        toggleAllValidatorFilters,
        validatorSearchFilter,
        validatorFilters,
        validatorOrder,
      }}
    >
      {children}
    </ValidatorFilterContext.Provider>
  );
};
