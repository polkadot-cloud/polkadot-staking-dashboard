// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useRef } from 'react';
import { useTooltip } from 'contexts/Tooltip';
import { TooltipPosition, TooltipTrigger } from '../Wrappers';

export const Commission = (props: { commission: number }) => {
  const { commission } = props;

  const { setTooltipPosition, setTooltipMeta, open } = useTooltip();

  const posRef = useRef<HTMLDivElement>(null);

  const tooltipText = 'Validator Commission';

  const toggleTooltip = () => {
    if (!open) {
      setTooltipMeta(tooltipText);
      setTooltipPosition(posRef);
    }
  };

  return (
    <div className="label">
      <TooltipTrigger
        className="tooltip-trigger-element"
        data-tooltip-text={tooltipText}
        onMouseMove={() => toggleTooltip()}
      />
      <TooltipPosition ref={posRef} />
      {commission}%
    </div>
  );
};
