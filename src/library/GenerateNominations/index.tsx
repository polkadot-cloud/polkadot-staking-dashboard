// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  faChartPie,
  faCoins,
  faHeart,
  faPlus,
  faTimes,
  faUserEdit,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { camelize } from '@polkadot-cloud/utils';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { useValidators } from 'contexts/Validators/ValidatorEntries';
import { useUnstaking } from 'library/Hooks/useUnstaking';
import { SelectableWrapper } from 'library/List';
import { SelectItems } from 'library/SelectItems';
import { SelectItem } from 'library/SelectItems/Item';
import { ValidatorList } from 'library/ValidatorList';
import { Wrapper } from 'pages/Overview/NetworkSats/Wrappers';
import { useStaking } from 'contexts/Staking';
import { useOverlay } from '@polkadot-cloud/react/hooks';
import { useFavoriteValidators } from 'contexts/Validators/FavoriteValidators';
import { useActiveAccounts } from 'contexts/Connect/ActiveAccounts';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';
import type {
  GenerateNominationsInnerProps,
  Nominations,
} from '../SetupSteps/types';
import { useFetchMehods } from './useFetchMethods';

export const GenerateNominations = ({
  setters = [],
  nominations: defaultNominations,
  batchKey,
}: GenerateNominationsInnerProps) => {
  const { t } = useTranslation('library');
  const { isReady, consts } = useApi();
  const { openModal } = useOverlay().modal;
  const { isFastUnstaking } = useUnstaking();
  const { stakers } = useStaking().eraStakers;
  const { favoritesList } = useFavoriteValidators();
  const { isReadOnlyAccount } = useImportedAccounts();
  const { activeAccount } = useActiveAccounts();
  const { validators, validatorIdentities, validatorSupers } = useValidators();
  const {
    fetch: fetchFromMethod,
    add: addNomination,
    available: availableToNominate,
  } = useFetchMehods();
  const { maxNominations } = consts;

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

  // update nominations on account switch
  useEffect(() => {
    if (nominations !== defaultNominations) {
      setNominations([...defaultNominations]);
    }
  }, [activeAccount]);

  // refetch if fetching is triggered
  useEffect(() => {
    if (!isReady || !validators.length) {
      return;
    }

    if (
      !stakers.length ||
      !Object.values(validatorIdentities).length ||
      !Object.values(validatorSupers).length
    ) {
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
      const newNominations = fetchFromMethod(method);
      // update component state
      setNominations([...newNominations]);
      setFetching(false);
      updateSetters(newNominations);
    }
  };

  // add nominations based on method
  const addNominationByType = (type: string) => {
    if (method) {
      const newNominations = addNomination(nominations, type);
      setNominations([...newNominations]);
      updateSetters([...newNominations]);
    }
  };

  const updateSetters = (newNominations: Nominations) => {
    for (const { current, set } of setters) {
      const currentValue = current?.callable ? current.fn() : current;
      set({
        ...currentValue,
        nominations: newNominations,
      });
    }
  };

  // callback function for adding nominations.
  const cbAddNominations = ({ setSelectActive }: any) => {
    setSelectActive(false);

    const updateList = (_nominations: Nominations) => {
      setNominations([..._nominations]);
      updateSetters(_nominations);
    };
    openModal({
      key: 'SelectFavorites',
      options: {
        nominations,
        callback: updateList,
      },
      size: 'xl',
    });
  };

  // function for clearing nomination list
  const clearNominations = () => {
    setMethod(null);
    setNominations([]);
    updateSetters([]);
  };

  // callback function for removing selected validators
  const cbRemoveSelected = ({
    selected,
    resetSelected,
    setSelectActive,
  }: any) => {
    const newNominations = [...nominations].filter(
      (n: any) => !selected.map((_s: any) => _s.address).includes(n.address)
    );
    setNominations([...newNominations]);
    updateSetters([...newNominations]);
    setSelectActive(false);
    resetSelected();
  };

  const disabledMaxNominations = () =>
    maxNominations.isLessThanOrEqualTo(nominations.length);
  const disabledAddFavorites = () =>
    !favoritesList?.length ||
    maxNominations.isLessThanOrEqualTo(nominations.length);

  // accumulate generation methods
  const methods = [
    {
      title: t('optimalSelection'),
      subtitle: t('optimalSelectionSubtitle'),
      icon: faChartPie,
      onClick: () => {
        setMethod('Optimal Selection');
        setNominations([]);
        setFetching(true);
      },
    },
    {
      title: t('activeLowCommission'),
      subtitle: t('activeLowCommissionSubtitle'),
      icon: faCoins,
      onClick: () => {
        setMethod('Active Low Commission');
        setNominations([]);
        setFetching(true);
      },
    },
    {
      title: t('fromFavorites'),
      subtitle: t('fromFavoritesSubtitle'),
      icon: faHeart,
      onClick: () => {
        setMethod('From Favorites');
        setNominations([]);
        setFetching(true);
      },
    },
    {
      title: t('manual_selection'),
      subtitle: t('manualSelectionSubtitle'),
      icon: faUserEdit,
      onClick: () => {
        setMethod('Manual');
        setNominations([]);
      },
    },
  ];

  // accumulate actions
  const actions = [
    {
      title: t('addFromFavorites'),
      onClick: cbAddNominations,
      onSelected: false,
      isDisabled: disabledAddFavorites,
    },
    {
      title: `${t('removeSelected')}`,
      onClick: cbRemoveSelected,
      onSelected: true,
      isDisabled: () => false,
    },
    {
      title: t('parachainValidator'),
      onClick: () => addNominationByType('Parachain Validator'),
      onSelected: false,
      icon: faPlus,
      isDisabled: () =>
        disabledMaxNominations() ||
        !availableToNominate(nominations).parachainValidators.length,
    },
    {
      title: t('activeValidator'),
      onClick: () => addNominationByType('Active Validator'),
      onSelected: false,
      icon: faPlus,
      isDisabled: () =>
        disabledMaxNominations() ||
        !availableToNominate(nominations).activeValidators.length,
    },
    {
      title: t('randomValidator'),
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
            <FontAwesomeIcon icon={faTimes} />
            {t(`${camelize(method)}`)}
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
                setFetching(true);
              }}
            >
              {t('reGenerate')}
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
              <SelectItems layout="three-col">
                {methods.map((m: any, n: number) => (
                  <SelectItem
                    key={`gen_method_${n}`}
                    title={m.title}
                    subtitle={m.subtitle}
                    icon={m.icon}
                    selected={false}
                    onClick={m.onClick}
                    disabled={isFastUnstaking}
                    includeToggle={false}
                    grow={false}
                    hoverBorder
                    layout="three-col"
                  />
                ))}
              </SelectItems>
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
                  bondFor="nominator"
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
