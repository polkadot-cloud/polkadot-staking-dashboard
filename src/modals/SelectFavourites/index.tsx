// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useModal } from 'contexts/Modal';
import { useValidators } from 'contexts/Validators';
import { ValidatorList } from 'library/ValidatorList';
import { PaddingWrapper } from '../Wrappers';

export const SelectFavourites = () => {
  const { config } = useModal();
  const { favouritesList } = useValidators();
  const {
    nominations,
    provider: generateNominationsProvider,
    callback: generateNominationsCallback,
  }: any = config;

  const batchKey = 'favourite_validators';

  return (
    <PaddingWrapper>
      <h2>Select Favourites</h2>
      {favouritesList.length > 0 ? (
        <ValidatorList
          validators={favouritesList}
          batchKey={batchKey}
          title="Favourite Validators"
          selectable
          refetchOnListUpdate
        />
      ) : (
        <h3>No Favourites.</h3>
      )}
    </PaddingWrapper>
  );
};

export default SelectFavourites;
