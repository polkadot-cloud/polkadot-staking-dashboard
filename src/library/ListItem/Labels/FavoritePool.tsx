// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNotifications } from 'contexts/Notifications';
import { usePoolsConfig } from 'contexts/Pools/PoolsConfig';
import { useTooltip } from 'contexts/Tooltip';
import { TooltipPosition, TooltipTrigger } from 'library/ListItem/Wrappers';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FavoriteProps } from '../types';

export const FavoritePool = (props: FavoriteProps) => {
  const { addNotification } = useNotifications();
  const { favorites, addFavorite, removeFavorite } = usePoolsConfig();
  const { setTooltipPosition, setTooltipMeta, open } = useTooltip();
  const { t } = useTranslation('library');

  const { address } = props;
  const isFavorite = favorites.includes(address);

  const notificationFavorite = !isFavorite
    ? {
        title: t('favoritePoolAdded'),
        subtitle: address,
      }
    : {
        title: t('favoritePoolRemoved'),
        subtitle: address,
      };

  const posRef = useRef<HTMLDivElement>(null);

  const tooltipText = `${isFavorite ? `${t('remove')}` : `${t('add')}`} ${t(
    'favorite'
  )}`;

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
