// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faUserSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';
import { useTooltip } from 'contexts/Tooltip';
import { TooltipTrigger } from 'library/ListItem/Wrappers';
import type { BlockedProps } from '../types';

export const Blocked = ({ prefs }: BlockedProps) => {
  const { t } = useTranslation('library');
  const blocked = prefs?.blocked ?? null;
  const { setTooltipTextAndOpen } = useTooltip();

  const tooltipText = t('blockingNominations');

  return (
    blocked && (
      <div className="label">
        <TooltipTrigger
          className="tooltip-trigger-element"
          data-tooltip-text={tooltipText}
          onMouseMove={() => setTooltipTextAndOpen(tooltipText)}
        />
        <FontAwesomeIcon
          icon={faUserSlash}
          color="#d2545d"
          transform="shrink-1"
        />
      </div>
    )
  );
};
