// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faUserSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTooltip } from 'contexts/Tooltip';
import { TooltipPosition, TooltipTrigger } from 'library/ListItem/Wrappers';
import { useTranslation } from 'react-i18next';
import { useRef } from 'react';
import { BlockedProps } from '../types';

export const Blocked = (props: BlockedProps) => {
  const { prefs } = props;
  const blocked = prefs?.blocked ?? null;
  const { setTooltipPosition, setTooltipMeta, open } = useTooltip();
  const { t } = useTranslation('common');

  const posRef = useRef(null);

  const tooltipText = t('library.blocking_nominations');

  const toggleTooltip = () => {
    if (!open) {
      setTooltipMeta(tooltipText);
      setTooltipPosition(posRef);
    }
  };

  return (
    <>
      {blocked && (
        <>
          <div className="label">
            <TooltipTrigger
              className="tooltip-trigger-element"
              data-tooltip-text={tooltipText}
              onMouseMove={() => toggleTooltip()}
            />
            <TooltipPosition ref={posRef} />
            <FontAwesomeIcon
              icon={faUserSlash}
              color="#d2545d"
              transform="shrink-1"
            />
          </div>
        </>
      )}
    </>
  );
};

export default Blocked;
