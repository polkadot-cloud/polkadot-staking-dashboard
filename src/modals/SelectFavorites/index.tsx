// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ModalPadding } from '@polkadot-cloud/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import type { Validator } from 'contexts/Validators/types';
import { Title } from 'library/Modal/Title';
import { ValidatorList } from 'library/ValidatorList';
import { useOverlay } from '@polkadot-cloud/react/hooks';
import { useFavoriteValidators } from 'contexts/Validators/FavoriteValidators';
import { FooterWrapper, ListWrapper } from './Wrappers';

export const SelectFavorites = () => {
  const { t } = useTranslation('modals');
  const { consts } = useApi();
  const {
    config: { options },
    setModalStatus,
    setModalResize,
  } = useOverlay().modal;
  const { favoritesList } = useFavoriteValidators();
  const { maxNominations } = consts;
  const { nominations, callback: generateNominationsCallback } = options;

  // store filtered favorites
  const [availableFavorites, setAvailableFavorites] = useState<Validator[]>([]);

  // store selected favorites in local state
  const [selectedFavorites, setSelectedFavorites] = useState([]);

  // store filtered favorites
  useEffect(() => {
    if (favoritesList) {
      setAvailableFavorites(
        favoritesList.filter(
          (favorite) =>
            !nominations.find(
              (nomination: Validator) => nomination.address === favorite.address
            ) && !favorite.prefs.blocked
        )
      );
    }
  }, []);

  useEffect(() => setModalResize(), [selectedFavorites]);

  const batchKey = 'favorite_validators';

  const onSelected = (provider: any) => {
    const { selected } = provider;
    setSelectedFavorites(selected);
  };

  const submitSelectedFavorites = () => {
    if (!selectedFavorites.length) return;
    const newNominations = [...nominations].concat(...selectedFavorites);
    generateNominationsCallback(newNominations);
    setModalStatus('closing');
  };

  const totalAfterSelection = nominations.length + selectedFavorites.length;
  const overMaxNominations = maxNominations.isLessThan(totalAfterSelection);

  return (
    <>
      <Title title={t('addFromFavorites')} />
      <ModalPadding>
        <ListWrapper>
          {availableFavorites.length > 0 ? (
            <ValidatorList
              bondFor="nominator"
              validators={availableFavorites}
              batchKey={batchKey}
              title={t('favoriteValidators')}
              selectable
              selectActive
              selectToggleable={false}
              onSelected={onSelected}
              showMenu={false}
              displayFor="modal"
              allowMoreCols
              refetchOnListUpdate
            />
          ) : (
            <h3>{t('noFavoritesAvailable')}</h3>
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
                ? `${t('willSurpass', {
                    maxNominations: maxNominations.toString(),
                  })}`
                : `${t('addingFavorite', {
                    count: selectedFavorites.length,
                  })}`
              : `${t('noFavoritesSelected')}`}
          </button>
        </FooterWrapper>
      </ModalPadding>
    </>
  );
};
