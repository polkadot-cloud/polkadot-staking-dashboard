// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
  faChartPie,
  faCoins,
  faHeart,
  faPlus,
  faTimes,
  faUserEdit,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useValidators } from 'contexts/Validators';
import { ValidatorFilterProvider } from 'library/Filter/context';
import { LargeItem } from 'library/Filter/LargeItem';
import { SelectableWrapper } from 'library/List';
import { ValidatorList } from 'library/ValidatorList';
import { Wrapper } from 'pages/Overview/NetworkSats/Wrappers';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  GenerateNominationsInnerProps,
  Nominations,
} from '../SetupSteps/types';
import { useFetchMehods } from './useFetchMethods';
import { GenerateOptionsWrapper } from './Wrappers';

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
  const { t } = useTranslation('library');

  let { favoritesList } = useValidators();
  if (favoritesList === null) {
    favoritesList = [];
  }
  // store the method of fetching validators
  const [method, setMethod] = useState<string | null>(
    defaultNominations.length ? 'Manual' : null
  );

  // store whether validators are being fetched
  const [fetching, setFetching] = useState<boolean>(false);

  // store the currently selected set of nominations
  const [nominations, setNominations] = useState(defaultNominations);

  // store the height of the container
  const [height, setHeight] = useState<number | null>(null);

  // ref for the height of the container
  const heightRef = useRef<HTMLDivElement>(null);

  const rawBatchKey = 'validators_browse';

  // update nominations on account switch
  useEffect(() => {
    if (nominations !== defaultNominations) {
      removeValidatorMetaBatch(batchKey);
      setNominations([...defaultNominations]);
    }
  }, [activeAccount]);

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
      setNominations([..._nominations]);
      setFetching(false);
      updateSetters(_nominations);
    }
  };

  // add nominations based on method
  const addNominationByType = (type: string) => {
    if (method) {
      const _nominations = addNomination(nominations, type);
      removeValidatorMetaBatch(batchKey);
      setNominations([..._nominations]);
      updateSetters([..._nominations]);
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
      setNominations([..._nominations]);
      updateSetters(_nominations);
    };
    openModalWith(
      'SelectFavorites',
      {
        nominations,
        callback: updateList,
      },
      'xl'
    );
  };

  // function for clearing nomination list
  const clearNominations = () => {
    setMethod(null);
    removeValidatorMetaBatch(batchKey);
    setNominations([]);
    updateSetters([]);
  };

  // callback function for removing selected validators
  const cbRemoveSelected = ({
    selected,
    resetSelected,
    setSelectActive,
  }: any) => {
    removeValidatorMetaBatch(batchKey);
    const _nominations = [...nominations].filter((n: any) => {
      return !selected.map((_s: any) => _s.address).includes(n.address);
    });
    setNominations([..._nominations]);
    updateSetters([..._nominations]);
    setSelectActive(false);
    resetSelected();
  };

  const disabledMaxNominations = () => {
    return nominations.length >= maxNominations;
  };
  const disabledAddFavorites = () => {
    return !favoritesList?.length || nominations.length >= maxNominations;
  };

  // accumulate generation methods
  const methods = [
    {
      title: t('optimal_selection'),
      subtitle: t('mix_of_majority'),
      icon: faChartPie as IconProp,
      onClick: () => {
        setMethod('Optimal Selection');
        removeValidatorMetaBatch(batchKey);
        setNominations([]);
        setFetching(true);
      },
    },
    {
      title: t('active_low_commission'),
      subtitle: t('with_low_commission'),
      icon: faCoins as IconProp,
      onClick: () => {
        setMethod('Active Low Commission');
        removeValidatorMetaBatch(batchKey);
        setNominations([]);
        setFetching(true);
      },
    },
    {
      title: t('from_favorites'),
      subtitle: t('favorites_validators'),
      icon: faHeart as IconProp,
      onClick: () => {
        setMethod('From Favorites');
        removeValidatorMetaBatch(batchKey);
        setNominations([]);
        setFetching(true);
      },
    },
    {
      title: t('manual_selection'),
      subtitle: t('add_validators_from_scratch'),
      icon: faUserEdit as IconProp,
      onClick: () => {
        setMethod('Manual');
        removeValidatorMetaBatch(batchKey);
        setNominations([]);
      },
    },
  ];

  // accumulate actions
  const actions = [
    {
      title: t('add_from_favorites'),
      onClick: cbAddNominations,
      onSelected: false,
      isDisabled: disabledAddFavorites,
    },
    {
      title: `${t('remove_selected')}`,
      onClick: cbRemoveSelected,
      onSelected: true,
      isDisabled: () => false,
    },
    {
      title: t('parachain_validator'),
      onClick: () => addNominationByType('Parachain Validator'),
      onSelected: false,
      icon: faPlus,
      isDisabled: () =>
        disabledMaxNominations() ||
        !availableToNominate(nominations).parachainValidators.length,
    },
    {
      title: t('active_validator'),
      onClick: () => addNominationByType('Active Validator'),
      onSelected: false,
      icon: faPlus,
      isDisabled: () =>
        disabledMaxNominations() ||
        !availableToNominate(nominations).activeValidators.length,
    },
    {
      title: t('random_validator'),
      onClick: () => addNominationByType('Random Validator'),
      onSelected: false,
      icon: faPlus,
      isDisabled: () =>
        disabledMaxNominations() ||
        !availableToNominate(nominations).randomValidators.length,
    },
  ];

  return (
    <>
      {method && (
        <SelectableWrapper>
          <button type="button" onClick={() => clearNominations()}>
            <FontAwesomeIcon icon={faTimes as IconProp} />
            {method}
          </button>

          {['Active Low Commission', 'Optimal Selection'].includes(
            method || ''
          ) && (
            <button
              type="button"
              onClick={() => {
                // set a temporary height to prevent height snapping on re-renders.
                setHeight(heightRef?.current?.clientHeight || null);
                setTimeout(() => setHeight(null), 200);
                removeValidatorMetaBatch(batchKey);
                setFetching(true);
              }}
            >
              {t('re_generate')}
            </button>
          )}
        </SelectableWrapper>
      )}
      <Wrapper
        style={{
          height: height ? `${height}px` : 'auto',
          marginTop: method ? '1rem' : 0,
        }}
      >
        <div>
          {!isReadOnlyAccount(activeAccount) && !method && (
            <>
              <GenerateOptionsWrapper>
                {methods.map((m: any, n: number) => (
                  <LargeItem
                    key={`gen_method_${n}`}
                    title={m.title}
                    subtitle={m.subtitle}
                    icon={m.icon}
                    transform="grow-2"
                    active={false}
                    onClick={m.onClick}
                  />
                ))}
              </GenerateOptionsWrapper>
            </>
          )}
        </div>

        {fetching ? (
          <></>
        ) : (
          <>
            {isReady && method !== null && (
              <div
                ref={heightRef}
                style={{
                  width: '100%',
                }}
              >
                <ValidatorList
                  bondType="stake"
                  validators={nominations}
                  batchKey={batchKey}
                  selectable
                  actions={actions}
                  allowMoreCols
                  allowListFormat={false}
                />
              </div>
            )}
          </>
        )}
      </Wrapper>
    </>
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
