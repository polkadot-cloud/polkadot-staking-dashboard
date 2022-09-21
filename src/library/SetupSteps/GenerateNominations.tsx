// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useValidators } from 'contexts/Validators';
import { ValidatorList } from 'library/ValidatorList';
import { useModal } from 'contexts/Modal';
import { LargeItem } from 'library/Filter/LargeItem';
import {
  faHeart,
  faUserEdit,
  faChartPie,
  faCoins,
} from '@fortawesome/free-solid-svg-icons';
import { Validator } from 'contexts/Validators/types';
import {
  useValidatorFilter,
  ValidatorFilterProvider,
} from 'library/Filter/context';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Wrapper } from 'pages/Overview/NetworkSats/Wrappers';
import { shuffle } from 'Utils';
import { GenerateNominationsInnerProps, Nominations } from './types';

export const GenerateNominationsInner = (
  props: GenerateNominationsInnerProps
) => {
  // functional props
  const setters = props.setters ?? [];
  const defaultNominations = props.nominations;
  const { batchKey } = props;

  const { openModalWith } = useModal();
  const { isReady } = useApi();
  const { activeAccount, isReadOnlyAccount } = useConnect();
  const { removeValidatorMetaBatch, validators, meta } = useValidators();
  const { applyValidatorOrder, applyValidatorFilters } = useValidatorFilter();

  let { favouritesList } = useValidators();
  if (favouritesList === null) {
    favouritesList = [];
  }
  // store the method of fetching validators
  const [method, setMethod] = useState<string | null>(null);

  // store whether validators are being fetched
  const [fetching, setFetching] = useState<boolean>(false);

  // store the currently selected set of nominations
  const [nominations, setNominations] = useState(defaultNominations);

  const rawBatchKey = 'validators_browse';

  // update selected value on account switch
  useEffect(() => {
    setNominations(defaultNominations);
  }, [activeAccount, defaultNominations]);

  // refetch if fetching is triggered
  useEffect(() => {
    if (!isReady || !validators.length) {
      return;
    }

    // wait for validator meta data to be fetched
    const batch = meta[rawBatchKey];
    if (batch === undefined) {
      return;
    }
    if (batch.stake === undefined) {
      return;
    }

    if (fetching) {
      fetchNominationsForMethod();
    }
  });

  // fetch nominations based on method
  const fetchNominationsForMethod = () => {
    let _nominations;

    switch (method) {
      case 'Optimal':
        _nominations = fetchOptimal();
        break;
      case 'Lowest Commission':
        _nominations = fetchLowCommission();
        break;
      case 'Favourites':
        _nominations = fetchFavourites();
        break;
      default:
        return;
    }

    // update component state
    setNominations(_nominations);
    setFetching(false);

    // apply update to setters
    updateSetters(_nominations);
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

  const updateSetters = (_nominations: Nominations) => {
    for (const s of setters) {
      const { current, set } = s;
      const callable = current?.callable ?? false;
      let _current;

      if (!callable) {
        _current = current;
      } else {
        _current = current.fn();
      }
      const _set = {
        ..._current,
        nominations: _nominations,
      };
      set(_set);
    }
  };

  // callback function for adding nominations
  const cbAddNominations = ({ setSelectActive }: any) => {
    setSelectActive(false);

    const updateList = (_nominations: Nominations) => {
      removeValidatorMetaBatch(batchKey);
      setNominations(_nominations);
      updateSetters(_nominations);
    };
    openModalWith(
      'SelectFavourites',
      {
        nominations,
        callback: updateList,
      },
      'xl'
    );
  };

  // callback function for clearing nomination list
  const cbClearNominations = ({ resetSelected }: any) => {
    setMethod(null);
    removeValidatorMetaBatch(batchKey);
    setNominations([]);
    updateSetters([]);
    resetSelected();
  };

  // callback function for removing selected validators
  const cbRemoveSelected = ({
    selected,
    resetSelected,
    setSelectActive,
  }: any) => {
    setMethod('From List');
    removeValidatorMetaBatch(batchKey);
    const _nominations = [...nominations].filter((n: any) => {
      return !selected.map((_s: any) => _s.address).includes(n.address);
    });
    setNominations(_nominations);
    updateSetters(_nominations);
    setSelectActive(false);
    resetSelected();
  };

  // accumulate actions
  let actions = [
    {
      title: 'Start Again',
      onClick: cbClearNominations,
      onSelected: false,
    },
    {
      disabled: !favouritesList.length,
      title: 'Add From Favourites',
      onClick: cbAddNominations,
      onSelected: false,
    },
    {
      title: `Remove Selected`,
      onClick: cbRemoveSelected,
      onSelected: true,
    },
  ];

  // determine re-generate buttons
  if (['Lowest Commission', 'Optimal'].includes(method || '')) {
    actions.reverse().push({
      title: 'Re-Generate',
      onClick: () => {
        removeValidatorMetaBatch(batchKey);
        setNominations([]);
        setFetching(true);
      },
      onSelected: false,
    });
    actions = actions.reverse();
  }

  return (
    <Wrapper>
      <div>
        {!isReadOnlyAccount(activeAccount) && !method && (
          <>
            <div className="motion-buttons">
              <LargeItem
                title="Optimal"
                subtitle="Selects a mix of majority active and inactive validators."
                icon={faChartPie as IconProp}
                transform="grow-2"
                active={false}
                onClick={() => {
                  setMethod('Optimal');
                  removeValidatorMetaBatch(batchKey);
                  setNominations([]);
                  setFetching(true);
                }}
              />
              <LargeItem
                title="Active Low Commission "
                subtitle="Gets a set of active validators with low commission."
                icon={faCoins as IconProp}
                transform="grow-2"
                active={false}
                onClick={() => {
                  setMethod('Lowest Commission');
                  removeValidatorMetaBatch(batchKey);
                  setNominations([]);
                  setFetching(true);
                }}
              />
              <LargeItem
                title="From Favourites"
                subtitle="Gets a set of your favourite validators."
                icon={faHeart as IconProp}
                transform="grow-2"
                disabled={!favouritesList.length}
                active={false}
                onClick={() => {
                  setMethod('Favourites');
                  removeValidatorMetaBatch(batchKey);
                  setNominations([]);
                  setFetching(true);
                }}
              />
              <LargeItem
                title="Manual Selection"
                subtitle="Add validators from scratch."
                icon={faUserEdit as IconProp}
                transform="grow-2"
                active={false}
                onClick={() => {
                  setMethod('Manual');
                  removeValidatorMetaBatch(batchKey);
                  setNominations([]);
                }}
              />
            </div>
          </>
        )}
      </div>
      {fetching ? (
        <></>
      ) : (
        <>
          {isReady && method !== null && (
            <div style={{ marginTop: '1rem' }}>
              <ValidatorList
                bondType="stake"
                validators={nominations}
                batchKey={batchKey}
                selectable
                actions={actions}
                allowMoreCols
              />
            </div>
          )}
        </>
      )}
    </Wrapper>
  );
};

export const GenerateNominations = (props: GenerateNominationsInnerProps) => {
  return (
    <ValidatorFilterProvider>
      <GenerateNominationsInner {...props} />
    </ValidatorFilterProvider>
  );
};

export default GenerateNominations;
