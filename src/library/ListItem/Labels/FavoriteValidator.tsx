// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNotifications } from 'contexts/Notifications';
import { useTooltip } from 'contexts/Tooltip';
import { useValidators } from 'contexts/Validators';
import { TooltipTrigger } from 'library/ListItem/Wrappers';
import { useTranslation } from 'react-i18next';
import type { FavoriteProps } from '../types';

export const FavoriteValidator = ({ address }: FavoriteProps) => {
  const { t } = useTranslation('library');
  const { addNotification } = useNotifications();
  const { favorites, addFavorite, removeFavorite } = useValidators();
  const { setTooltipTextAndOpen } = useTooltip();

  const isFavorite = favorites.includes(address);

  const notificationFavorite = !isFavorite
    ? {
        title: t('favoriteValidatorAdded'),
        subtitle: address,
      }
    : {
        title: t('favoriteValidatorRemoved'),
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
          addNotification(notificationFavorite);
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
