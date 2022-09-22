// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState, useRef } from 'react';
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
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { ValidatorFilterProvider } from 'library/Filter/context';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Wrapper } from 'pages/Overview/NetworkSats/Wrappers';
import {
  GenerateNominationsInnerProps,
  Nominations,
} from '../SetupSteps/types';
import { GenerateOptionsWrapper } from './Wrappers';
import { useFetchMehods } from './useFetchMethods';

export const GenerateNominationsInner = (
  props: GenerateNominationsInnerProps
) => {
  // functional props
  const setters = props.setters ?? [];
  const defaultNominations = props.nominations;
  const { batchKey } = props;

  const { openModalWith } = useModal();
  const { isReady, consts } = useApi();
  const { activeAccount, isReadOnlyAccount } = useConnect();
  const { removeValidatorMetaBatch, validators, meta } = useValidators();
  const {
    fetch: fetchFromMethod,
    add: addNomination,
    available: availableToNominate,
  } = useFetchMehods();
  const { maxNominations } = consts;

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

  // store the height of the container
  const [height, setHeight] = useState<number | null>(null);

  // ref for the height of the container
  const heightRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (
      !['Lowest Commission', 'Optimal'].includes(method || '') ||
      method === null ||
      !nominations.length
    ) {
      setHeight(null);
    } else {
      const _height = heightRef?.current?.clientHeight;
      if (_height) {
        if (_height > 0) {
          setHeight(_height + 10);
        }
      }
    }
  }, [nominations, method]);

  // reset fixed height on window size change
  useEffect(() => {
    window.addEventListener('resize', resizeCallback);
    return () => {
      window.removeEventListener('resize', resizeCallback);
    };
  }, []);

  const resizeCallback = () => {
    setHeight(null);
  };

  // fetch nominations based on method
  const fetchNominationsForMethod = () => {
    if (method) {
      const _nominations = fetchFromMethod(method);
      // update component state
      setNominations(_nominations);
      setFetching(false);
      updateSetters(_nominations);
    }
  };

  // add nominations based on method
  const addNominationByType = (type: string) => {
    if (method) {
      const _nominations = addNomination(nominations, type);
      removeValidatorMetaBatch(batchKey);
      setNominations(_nominations);
      updateSetters(_nominations);
    }
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

  const disabledMaxNominations = () => {
    return nominations.length >= maxNominations;
  };
  const disabledAddFavourites = () => {
    return !favouritesList?.length || nominations.length >= maxNominations;
  };

  // accumulate actions
  let actions = [
    {
      title: 'Start Again',
      onClick: cbClearNominations,
      onSelected: false,
      isDisabled: () => false,
    },
    {
      title: 'Add From Favourites',
      onClick: cbAddNominations,
      onSelected: false,
      isDisabled: disabledAddFavourites,
    },
    {
      title: `Remove Selected`,
      onClick: cbRemoveSelected,
      onSelected: true,
      isDisabled: () => false,
    },
    {
      title: 'Parachain Validator',
      onClick: () => addNominationByType('Parachain Validator'),
      onSelected: false,
      icon: faPlus,
      isDisabled: () =>
        disabledMaxNominations() ||
        !availableToNominate(nominations).parachainValidators.length,
    },
    {
      title: 'Active Validator',
      onClick: () => addNominationByType('Active Validator'),
      onSelected: false,
      icon: faPlus,
      isDisabled: () =>
        disabledMaxNominations() ||
        !availableToNominate(nominations).activeValidators.length,
    },
    {
      title: 'Random Validator',
      onClick: () => addNominationByType('Random Validator'),
      onSelected: false,
      icon: faPlus,
      isDisabled: () =>
        disabledMaxNominations() ||
        !availableToNominate(nominations).randomValidators.length,
    },
  ];

  // determine re-generate buttons
  if (['Lowest Commission', 'Optimal'].includes(method || '')) {
    actions.reverse().push({
      title: 'Re-Generate',
      onClick: () => {
        removeValidatorMetaBatch(batchKey);
        setFetching(true);
      },
      onSelected: false,
      isDisabled: () => false,
    });
    actions = actions.reverse();
  }

  return (
    <Wrapper style={{ height: height ? `${height}px` : 'auto' }}>
      <div>
        {!isReadOnlyAccount(activeAccount) && !method && (
          <>
            <GenerateOptionsWrapper>
              <LargeItem
                title="Optimal Selection"
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
                title="Active Low Commission"
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
            </GenerateOptionsWrapper>
          </>
        )}
      </div>
      {fetching ? (
        <></>
      ) : (
        <>
          {isReady && method !== null && (
            <div ref={heightRef}>
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
