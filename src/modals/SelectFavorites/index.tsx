// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';
import { useModal } from 'contexts/Modal';
import { useValidators } from 'contexts/Validators';
import { ValidatorList } from 'library/ValidatorList';
import { useApi } from 'contexts/Api';
import { Validator } from 'contexts/Validators/types';
import { Title } from 'library/Modal/Title';
import { useTranslation } from 'react-i18next';
import { PaddingWrapper } from '../Wrappers';
import { ListWrapper, FooterWrapper } from './Wrappers';

export const SelectFavorites = () => {
  const { consts } = useApi();
  const { config, setStatus, setResize } = useModal();
  const { favoritesList } = useValidators();
  const { maxNominations } = consts;
  const { nominations, callback: generateNominationsCallback } = config;
  const { t } = useTranslation('common');

  // store filtered favorites
  const [availableFavorites, setAvailableFavorites] = useState<
    Array<Validator>
  >([]);

  // store selected favorites in local state
  const [selectedFavorites, setSelectedFavorites] = useState([]);

  // store filtered favorites
  useEffect(() => {
    if (favoritesList) {
      const _availableFavorites = favoritesList.filter(
        (favorite: Validator) =>
          !nominations.find(
            (nomination: Validator) => nomination.address === favorite.address
          ) && !favorite.prefs.blocked
      );
      setAvailableFavorites(_availableFavorites);
    }
  }, []);

  useEffect(() => {
    setResize();
  }, [selectedFavorites]);

  const batchKey = 'favorite_validators';

  const onSelected = (provider: any) => {
    const { selected } = provider;
    setSelectedFavorites(selected);
  };

  const submitSelectedFavorites = () => {
    if (!selectedFavorites.length) return;
    const newNominations = [...nominations].concat(...selectedFavorites);
    generateNominationsCallback(newNominations);
    setStatus(0);
  };

  const totalAfterSelection = nominations.length + selectedFavorites.length;
  const overMaxNominations = totalAfterSelection > maxNominations;

  return (
    <>
      <Title title={t('modals.add_from_favourites')} />
      <PaddingWrapper>
        <ListWrapper>
          {availableFavorites.length > 0 ? (
            <ValidatorList
              bondType="stake"
              validators={availableFavorites}
              batchKey={batchKey}
              title={t('modals.add_from_favourites')}
              selectable
              selectActive
              selectToggleable={false}
              onSelected={onSelected}
              refetchOnListUpdate
              showMenu={false}
              inModal
              allowMoreCols
            />
          ) : (
            <h3>{t('modals.no_favourites_available')}</h3>
          )}
        </ListWrapper>
        <FooterWrapper>
          <button
            type="button"
            disabled={!selectedFavorites.length || overMaxNominations}
            onClick={() => submitSelectedFavorites()}
          >
            {selectedFavorites.length > 0
              ? overMaxNominations
                ? `Adding this many favorites will surpass ${maxNominations} nominations.`
                : `Add ${selectedFavorites.length} Favorite${
                    selectedFavorites.length !== 1 ? `s` : ``
                  } to Nominations`
              : `No Favorites Selected`}
          </button>
        </FooterWrapper>
      </PaddingWrapper>
    </>
  );
};

export default SelectFavorites;
