// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { u8aToString, u8aUnwrapBytes } from '@polkadot/util';
import { useTranslation } from 'react-i18next';
import { useValidators } from 'contexts/Validators/ValidatorEntries';
import type { AnyFunction, AnyJson } from 'types';
import { useStaking } from 'contexts/Staking';
import { MaxEraRewardPointsEras } from 'consts';

export const useValidatorFilters = () => {
  const { t } = useTranslation('library');
  const {
    sessionValidators,
    sessionParaValidators,
    validatorIdentities,
    validatorSupers,
    validatorEraPointsHistory,
  } = useValidators();
  const { erasStakersSyncing, getLowestRewardFromStaker } = useStaking();

  /*
   * filterMissingIdentity: Iterates through the supplied list and filters those with missing
   * identities. Returns the updated filtered list.
   */
  const filterMissingIdentity = (list: any) => {
    // Return lsit early if identity sync has not completed.
    if (
      !Object.values(validatorIdentities).length ||
      !Object.values(validatorSupers).length
    ) {
      return list;
    }
    const filteredList: any = [];
    for (const validator of list) {
      const identityExists = validatorIdentities[validator.address] ?? false;
      const superExists = validatorSupers[validator.address] ?? false;

      // Validator included if identity or super identity has been set.
      if (!!identityExists || !!superExists) {
        filteredList.push(validator);
        continue;
      }
    }
    return filteredList;
  };

  /*
   * filterOverSubscribed: Iterates through the supplied list and filters those who are over
   * subscribed. Returns the updated filtered list.
   */
  const filterOverSubscribed = (list: any) => {
    // Return list early if eraStakers is still syncing.
    if (erasStakersSyncing) {
      return list;
    }

    const filteredList: any = [];
    for (const validator of list) {
      const { oversubscribed } = getLowestRewardFromStaker(validator.address);

      if (!oversubscribed) {
        filteredList.push(validator);
        continue;
      }
    }
    return filteredList;
  };

  /*
   * filterAllCommission: Filters the supplied list and removes items with 100% commission. Returns
   * the updated filtered list.
   */
  const filterAllCommission = (list: any) =>
    list.filter((validator: any) => validator?.prefs?.commission !== 100);

  /*
   * filterBlockedNominations: Filters the supplied list and removes items that have blocked
   * nominations. Returns the updated filtered list.
   */
  const filterBlockedNominations = (list: any) =>
    list.filter((validator: any) => validator?.prefs?.blocked !== true);

  /*
   * filterActive: Filters the supplied list and removes items that are inactive. Returns the
   * updated filtered list.
   */
  const filterActive = (list: any) => {
    // if list has not yet been populated, return original list
    if (sessionValidators.length === 0) return list;
    return list.filter((validator: any) =>
      sessionValidators.includes(validator.address)
    );
  };

  /*
   * filterNonParachainValidator: Filters the supplied list and removes items that are inactive.
   * Returns the updated filtered list.
   */
  const filterNonParachainValidator = (list: any) => {
    // if list has not yet been populated, return original list
    if ((sessionParaValidators?.length ?? 0) === 0) return list;
    return list.filter((validator: any) =>
      sessionParaValidators.includes(validator.address)
    );
  };

  /*
   * filterInSession: Filters the supplied list and removes items that are in the current session.
   * Returns the updated filtered list.
   */
  const filterInSession = (list: any) => {
    // if list has not yet been populated, return original list
    if (sessionValidators.length === 0) return list;
    return list.filter(
      (validator: any) => !sessionValidators.includes(validator.address)
    );
  };

  const includesToLabels: Record<string, string> = {
    active: t('activeValidators'),
  };

  const excludesToLabels: Record<string, string> = {
    over_subscribed: t('overSubscribed'),
    all_commission: t('100Commission'),
    blocked_nominations: t('blockedNominations'),
    missing_identity: t('missingIdentity'),
  };

  const filterToFunction: Record<string, AnyFunction> = {
    active: filterActive,
    missing_identity: filterMissingIdentity,
    over_subscribed: filterOverSubscribed,
    all_commission: filterAllCommission,
    blocked_nominations: filterBlockedNominations,
    not_parachain_validator: filterNonParachainValidator,
    in_session: filterInSession,
  };

  const getFiltersToApply = (excludes: string[]) => {
    const fns = [];
    for (const exclude of excludes) {
      if (filterToFunction[exclude]) {
        fns.push(filterToFunction[exclude]);
      }
    }
    return fns;
  };

  const applyFilter = (
    includes: string[] | null,
    excludes: string[] | null,
    list: AnyJson
  ) => {
    if (!excludes && !includes) {
      return list;
    }
    if (includes) {
      for (const fn of getFiltersToApply(includes)) {
        list = fn(list);
      }
    }
    if (excludes) {
      for (const fn of getFiltersToApply(excludes)) {
        list = fn(list);
      }
    }
    return list;
  };

  /*
   * orderLowestCommission: Orders a list by commission, lowest first. Returns the updated ordered
   * list.
   */
  const orderLowestCommission = (list: any) =>
    [...list].sort((a, b) => a.prefs.commission - b.prefs.commission);

  /*
   * orderHighestCommission: Orders a list by commission, highest first. Returns the updated ordered
   * list.
   */
  const orderHighestCommission = (list: any) =>
    [...list].sort((a, b) => b.prefs.commission - a.prefs.commission);

  /*
   * orderByRank: Orders a list by validator rank.
   */
  const orderByRank = (list: any) =>
    [...list].sort((a, b) => {
      const aRank = validatorEraPointsHistory[a.address]?.rank || 9999;
      const bRank = validatorEraPointsHistory[b.address]?.rank || 9999;
      return aRank - bRank;
    });

  const ordersToLabels: Record<string, string> = {
    rank: `${MaxEraRewardPointsEras} ${t('dayPerformance')}`,
    low_commission: t('lowCommission'),
    high_commission: t('highCommission'),
    default: t('unordered'),
  };

  const orderToFunction: Record<string, AnyFunction> = {
    rank: orderByRank,
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
   * applySearch Iterates through the supplied list and filters those that match the search term.
   * Returns the updated filtered list.
   */
  const applySearch = (list: any, searchTerm: string) => {
    // If we cannot derive data, fallback to include validator in filtered list.
    if (
      !searchTerm ||
      !Object.values(validatorIdentities).length ||
      !Object.values(validatorSupers).length
    ) {
      return list;
    }

    const filteredList: any = [];
    for (const validator of list) {
      const identity = validatorIdentities[validator.address] ?? '';
      const identityRaw = identity?.info?.display?.Raw ?? '';
      const identityAsBytes = u8aToString(u8aUnwrapBytes(identityRaw));
      const identitySearch = (
        identityAsBytes === '' ? identityRaw : identityAsBytes
      ).toLowerCase();

      const superIdentity = validatorSupers[validator.address] ?? null;
      const superIdentityRaw =
        superIdentity?.identity?.info?.display?.Raw ?? '';
      const superIdentityAsBytes = u8aToString(
        u8aUnwrapBytes(superIdentityRaw)
      );
      const superIdentitySearch = (
        superIdentityAsBytes === '' ? superIdentityRaw : superIdentityAsBytes
      ).toLowerCase();

      if (validator.address.toLowerCase().includes(searchTerm.toLowerCase()))
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
    includesToLabels,
    excludesToLabels,
    ordersToLabels,
    applyFilter,
    applyOrder,
    applySearch,
  };
};
