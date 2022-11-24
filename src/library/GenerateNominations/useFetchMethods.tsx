// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useValidators } from 'contexts/Validators';
import { Validator } from 'contexts/Validators/types';
import { useValidatorFilters } from 'library/Hooks/useValidatorFilters';
import { shuffle } from 'Utils';

export const useFetchMehods = () => {
  const { validators, sessionParachain } = useValidators();
  const { applyFilter, applyOrder } = useValidatorFilters();
  let { favoritesList } = useValidators();
  if (favoritesList === null) {
    favoritesList = [];
  }

  const rawBatchKey = 'validators_browse';

  const fetch = (method: string) => {
    let nominations;
    switch (method) {
      case 'Optimal Selection':
        nominations = fetchOptimal();
        break;
      case 'Active Low Commission':
        nominations = fetchLowCommission();
        break;
      case 'From Favorites':
        nominations = fetchFavorites();
        break;
      default:
        return [];
    }
    return nominations;
  };

  const add = (nominations: any, type: string) => {
    switch (type) {
      case 'Parachain Validator':
        nominations = addParachainValidator(nominations);
        break;
      case 'Active Validator':
        nominations = addActiveValidator(nominations);
        break;
      case 'Random Validator':
        nominations = addRandomValidator(nominations);
        break;
      default:
        return nominations;
    }
    return nominations;
  };

  const fetchFavorites = () => {
    let _favs: Array<Validator> = [];

    if (!favoritesList) {
      return _favs;
    }

    if (favoritesList.length) {
      // take subset of up to 16 favorites
      _favs = favoritesList.slice(0, 16);
    }
    return _favs;
  };

  const fetchLowCommission = () => {
    let _nominations = Object.assign(validators);

    // filter validators to find active candidates
    _nominations = applyFilter(
      ['active'],
      ['all_commission', 'blocked_nominations', 'missing_identity'],
      _nominations,
      rawBatchKey
    );

    // order validators to find profitable candidates
    _nominations = applyOrder('low_commission', _nominations);

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
    _nominationsWaiting = applyFilter(
      null,
      [
        'all_commission',
        'blocked_nominations',
        'missing_identity',
        'in_session',
      ],
      _nominationsWaiting,
      rawBatchKey
    );

    // filter validators to find active candidates
    _nominationsActive = applyFilter(
      ['active'],
      ['all_commission', 'blocked_nominations', 'missing_identity'],
      _nominationsActive,
      rawBatchKey
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

  const available = (nominations: any) => {
    const _nominations = Object.assign(validators);

    const _parachainValidators = applyFilter(
      ['active'],
      [
        'all_commission',
        'blocked_nominations',
        'missing_identity',
        'not_parachain_validator',
      ],
      _nominations,
      rawBatchKey
    ).filter(
      (n: any) => !nominations.find((o: any) => o.address === n.address)
    );

    const _activeValidators = applyFilter(
      ['active'],
      ['all_commission', 'blocked_nominations', 'missing_identity'],
      _nominations,
      rawBatchKey
    )
      .filter(
        (n: any) => !nominations.find((o: any) => o.address === n.address)
      )
      .filter((n: any) => !sessionParachain?.includes(n.address) || false);

    const _randomValidator = applyFilter(
      null,
      ['all_commission', 'blocked_nominations', 'missing_identity'],
      _nominations,
      rawBatchKey
    ).filter(
      (n: any) => !nominations.find((o: any) => o.address === n.address)
    );

    return {
      parachainValidators: _parachainValidators,
      activeValidators: _activeValidators,
      randomValidators: _randomValidator,
    };
  };

  const addActiveValidator = (nominations: any) => {
    const _nominations = available(nominations).activeValidators;

    // take one validator
    const validator = shuffle(_nominations).slice(0, 1)[0] || null;
    if (validator) {
      nominations.push(validator);
    }
    return nominations;
  };

  const addParachainValidator = (nominations: any) => {
    const _nominations = available(nominations).parachainValidators;

    // take one validator
    const validator = shuffle(_nominations).slice(0, 1)[0] || null;
    if (validator) {
      nominations.push(validator);
    }
    return nominations;
  };

  const addRandomValidator = (nominations: any) => {
    const _nominations = available(nominations).randomValidators;

    // take one validator
    const validator = shuffle(_nominations).slice(0, 1)[0] || null;

    if (validator) {
      nominations.push(validator);
    }
    return nominations;
  };

  return {
    fetch,
    add,
    available,
  };
};
