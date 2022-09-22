// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useValidators } from 'contexts/Validators';
import { Validator } from 'contexts/Validators/types';
import { useValidatorFilter } from 'library/Filter/context';
import { shuffle } from 'Utils';

export const useFetchMehods = () => {
  const { validators } = useValidators();
  const { applyValidatorOrder, applyValidatorFilters } = useValidatorFilter();
  let { favouritesList } = useValidators();
  if (favouritesList === null) {
    favouritesList = [];
  }

  const rawBatchKey = 'validators_browse';

  const fetch = (method: string) => {
    let nominations;
    switch (method) {
      case 'Optimal':
        nominations = fetchOptimal();
        break;
      case 'Lowest Commission':
        nominations = fetchLowCommission();
        break;
      case 'Favourites':
        nominations = fetchFavourites();
        break;
      default:
        return [];
    }
    return nominations;
  };

  const fetchFavourites = () => {
    let _favs: Array<Validator> = [];

    if (!favouritesList) {
      return _favs;
    }

    if (favouritesList.length) {
      // take subset of up to 16 favourites
      _favs = favouritesList.slice(0, 16);
    }
    return _favs;
  };

  const fetchLowCommission = () => {
    let _nominations = Object.assign(validators);

    // filter validators to find active candidates
    _nominations = applyValidatorFilters(_nominations, rawBatchKey, [
      'all_commission',
      'blocked_nominations',
      'inactive',
      'missing_identity',
    ]);

    // order validators to find profitable candidates
    _nominations = applyValidatorOrder(_nominations, 'commission');

    // choose shuffled subset of validators
    if (_nominations.length) {
      _nominations = shuffle(
        _nominations.slice(0, _nominations.length * 0.5)
      ).slice(0, 16);
    }
    return _nominations;
  };

  const fetchOptimal = () => {
    let _nominationsActive = Object.assign(validators);
    let _nominationsWaiting = Object.assign(validators);

    // filter validators to find waiting candidates
    _nominationsWaiting = applyValidatorFilters(
      _nominationsWaiting,
      rawBatchKey,
      [
        'all_commission',
        'blocked_nominations',
        'missing_identity',
        'in_session',
      ]
    );

    // filter validators to find active candidates
    _nominationsActive = applyValidatorFilters(
      _nominationsActive,
      rawBatchKey,
      ['all_commission', 'blocked_nominations', 'missing_identity', 'inactive']
    );

    // choose shuffled subset of waiting
    if (_nominationsWaiting.length) {
      _nominationsWaiting = shuffle(_nominationsWaiting).slice(0, 4);
    }
    // choose shuffled subset of active
    if (_nominationsWaiting.length) {
      _nominationsActive = shuffle(_nominationsActive).slice(0, 12);
    }

    return shuffle(_nominationsWaiting.concat(_nominationsActive));
  };

  return {
    fetch,
  };
};
