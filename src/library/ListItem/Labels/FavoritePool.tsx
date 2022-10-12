// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { useNotifications } from 'contexts/Notifications';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useTooltip } from 'contexts/Tooltip';
import { useRef } from 'react';
import { TooltipPosition, TooltipTrigger } from 'library/ListItem/Wrappers';
import { usePoolsConfig } from 'contexts/Pools/PoolsConfig';
import { FavoriteProps } from '../types';

export const FavoritePool = (props: FavoriteProps) => {
  const { addNotification } = useNotifications();
  const { favorites, addFavorite, removeFavorite } = usePoolsConfig();
  const { setTooltipPosition, setTooltipMeta, open } = useTooltip();

  const { address } = props;
  const isFavorite = favorites.includes(address);

  const notificationFavorite = !isFavorite
    ? {
        title: 'Favorite Pool Added',
        subtitle: address,
      }
    : {
        title: 'Favorite Pool Removed',
        subtitle: address,
      };

  const posRef = useRef<HTMLDivElement>(null);

  const tooltipText = `${isFavorite ? `Remove` : `Add`} Favorite`;

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
          if (isFavorite) {
            removeFavorite(address);
          } else {
            addFavorite(address);
          }
          addNotification(notificationFavorite);
        }}
      />
      <TooltipPosition ref={posRef} />
      <button type="button" className={isFavorite ? 'active' : undefined}>
        <FontAwesomeIcon
          icon={
            !isFavorite ? (faHeartRegular as IconProp) : (faHeart as IconProp)
          }
          transform="shrink-2"
        />
      </button>
    </div>
  );
};
