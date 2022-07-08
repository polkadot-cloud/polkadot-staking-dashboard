// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserSlash } from '@fortawesome/free-solid-svg-icons';
import { useTooltip } from 'contexts/Tooltip';
import { BlockedProps } from '../types';
import { TooltipPosition, TooltipTrigger } from '../Wrappers';

export const Blocked = (props: BlockedProps) => {
  const { prefs } = props;
  const blocked = prefs?.blocked ?? null;
  const { setTooltipPosition, setTooltipMeta, open } = useTooltip();

  const posRef = useRef(null);

  const tooltipText = 'Blocking Nominations';

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
