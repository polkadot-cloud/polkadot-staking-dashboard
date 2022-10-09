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
import { useTranslation } from 'react-i18next';
import { FavouriteProps } from '../types';

export const FavouritePool = (props: FavouriteProps) => {
  const { addNotification } = useNotifications();
  const { favourites, addFavourite, removeFavourite } = usePoolsConfig();
  const { setTooltipPosition, setTooltipMeta, open } = useTooltip();
  const { t } = useTranslation('common');

  const { address } = props;
  const isFavourite = favourites.includes(address);

  const notificationFavourite = !isFavourite
    ? {
        title: t('library.favourite_pool_added'),
        subtitle: address,
      }
    : {
        title: t('library.favourite_pool_removed'),
        subtitle: address,
      };

  const posRef = useRef<HTMLDivElement>(null);

  const tooltipText = `${
    isFavourite ? `${t('library.remove')}` : `${t('library.add')}`
  } ${t('library.favourite')}`;

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
            !isFavourite ? (faHeartRegular as IconProp) : (faHeart as IconProp)
          }
          transform="shrink-2"
        />
      </button>
    </div>
  );
};
