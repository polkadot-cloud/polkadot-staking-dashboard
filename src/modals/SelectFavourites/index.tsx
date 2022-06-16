// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';
import { useModal } from 'contexts/Modal';
import { useValidators } from 'contexts/Validators';
import { ValidatorList } from 'library/ValidatorList';
import { useApi } from 'contexts/Api';
import { APIContextInterface } from 'types/api';
import { PaddingWrapper } from '../Wrappers';
import { ListWrapper, FooterWrapper } from './Wrappers';

export const SelectFavourites = () => {
  const { consts } = useApi() as APIContextInterface;
  const { config, setStatus, setResize } = useModal();
  const { favouritesList } = useValidators();
  const { maxNominations } = consts;
  const { nominations, callback: generateNominationsCallback }: any = config;
  const [selectedFavourites, setSelectedFavourites] = useState([]);

  useEffect(() => {
    setResize();
  }, [selectedFavourites]);

  const batchKey = 'favourite_validators';

  const onSelected = (provider: any) => {
    const { selected } = provider;
    setSelectedFavourites(selected);
  };

  const submitSelectedFavourites = () => {
    if (!selectedFavourites.length) return;
    const newNominations = [...nominations].concat(...selectedFavourites);
    generateNominationsCallback(newNominations);
    setStatus(0);
  };

  const totalAfterSelection = nominations.length + selectedFavourites.length;
  const overMaxNominations = totalAfterSelection > maxNominations;

  return (
    <PaddingWrapper>
      <h2>Add From Favourites</h2>
      <ListWrapper>
        {favouritesList.length > 0 ? (
          <ValidatorList
            validators={favouritesList}
            batchKey={batchKey}
            title="Favourite Validators"
            selectable
            selectActive
            onSelected={onSelected}
            refetchOnListUpdate
            showMenu={false}
            inModal
          />
        ) : (
          <h3>No Favourites.</h3>
        )}
      </ListWrapper>
      <FooterWrapper>
        <button
          type="button"
          disabled={!selectedFavourites.length || overMaxNominations}
          onClick={() => submitSelectedFavourites()}
        >
          {selectedFavourites.length > 0
            ? overMaxNominations
              ? `Adding this many favourites will surpass ${maxNominations} nominations.`
              : `Add ${selectedFavourites.length} Favourite${
                  selectedFavourites.length !== 1 ? `s` : ``
                } to Nominations`
            : `No Favourites Selected`}
        </button>
      </FooterWrapper>
    </PaddingWrapper>
  );
};

export default SelectFavourites;
