// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { useNotifications } from 'contexts/Notifications';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useTooltip } from 'contexts/Tooltip';
import { useRef } from 'react';
import { TooltipPosition, TooltipTrigger } from 'library/ListItem/Wrappers';
import { usePoolsConfig } from 'contexts/Pools/PoolsConfig';
import { FavouriteProps } from '../types';

export const FavouritePool = (props: FavouriteProps) => {
  const { addNotification } = useNotifications();
  const { favourites, addFavourite, removeFavourite } = usePoolsConfig();
  const { setTooltipPosition, setTooltipMeta, open } = useTooltip();

  const { address } = props;
  const isFavourite = favourites.includes(address);

  const notificationFavourite = !isFavourite
    ? {
        title: 'Favourite Pool Added',
        subtitle: address,
      }
    : {
        title: 'Favourite Pool Removed',
        subtitle: address,
      };

  const posRef = useRef<HTMLDivElement>(null);

  const tooltipText = `${isFavourite ? `Remove` : `Add`} Favourite`;

  const toggleTooltip = () => {
    if (!open) {
      setTooltipMeta(tooltipText);
      setTooltipPosition(posRef);
    }
  };

  return (
    <div className="label pool">
      <TooltipTrigger
        className="tooltip-trigger-element as-button"
        data-tooltip-text={tooltipText}
        onMouseMove={() => toggleTooltip()}
        onClick={() => {
          if (isFavourite) {
            removeFavourite(address);
          } else {
            addFavourite(address);
          }
          addNotification(notificationFavourite);
        }}
      />
      <TooltipPosition ref={posRef} />
      <button type="button" className={isFavourite ? 'active' : undefined}>
        <FontAwesomeIcon
          icon={
            !isFavourite ? (faStarRegular as IconProp) : (faStar as IconProp)
          }
          transform="shrink-2"
        />
      </button>
    </div>
  );
};
