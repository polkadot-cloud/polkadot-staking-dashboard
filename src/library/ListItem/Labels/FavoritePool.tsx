// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';
import { useFavoritePools } from 'contexts/Pools/FavoritePools';
import { useTooltip } from 'contexts/Tooltip';
import { TooltipTrigger } from 'library/ListItem/Wrappers';
import type { FavoriteProps } from '../types';
import { NotificationsController } from 'controllers/NotificationsController';

export const FavoritePool = ({ address }: FavoriteProps) => {
  const { t } = useTranslation('library');
  const { setTooltipTextAndOpen } = useTooltip();
  const { favorites, addFavorite, removeFavorite } = useFavoritePools();

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

  const tooltipText = `${isFavorite ? `${t('remove')}` : `${t('add')}`} ${t(
    'favorite'
  )}`;

  return (
    <div className="label">
      <TooltipTrigger
        className="tooltip-trigger-element as-button"
        data-tooltip-text={tooltipText}
        onMouseMove={() => setTooltipTextAndOpen(tooltipText)}
        onClick={() => {
          if (isFavorite) {
            removeFavorite(address);
          } else {
            addFavorite(address);
          }
          NotificationsController.emit(notificationFavorite);
        }}
      />
      <button type="button" className={isFavorite ? 'active' : undefined}>
        <FontAwesomeIcon
          icon={!isFavorite ? faHeartRegular : faHeart}
          transform="shrink-2"
        />
      </button>
    </div>
  );
};
