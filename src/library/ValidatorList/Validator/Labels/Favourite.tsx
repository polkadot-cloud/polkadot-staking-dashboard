// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbtack } from '@fortawesome/free-solid-svg-icons';
import { useValidators } from 'contexts/Validators';
import { useNotifications } from 'contexts/Notifications';
import { FavouriteProps } from '../types';

export const Favourite = (props: FavouriteProps) => {
  const { addNotification } = useNotifications();
  const { favourites, addFavourite, removeFavourite } = useValidators();
  const { address } = props;

  const notificationFavourite = !favourites.includes(address)
    ? {
        title: 'Favourite Validator Added',
        subtitle: address,
      }
    : {
        title: 'Favourite Validator Removed',
        subtitle: address,
      };

  return (
    <div className="label">
      <button
        type="button"
        className={favourites.includes(address) ? 'active' : undefined}
        onClick={() => {
          if (favourites.includes(address)) {
            removeFavourite(address);
          } else {
            addFavourite(address);
          }
          addNotification(notificationFavourite);
        }}
      >
        <FontAwesomeIcon icon={faThumbtack} transform="shrink-2" />
      </button>
    </div>
  );
};

export default Favourite;
