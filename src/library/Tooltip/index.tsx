// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useRef, useEffect } from 'react';
import { useTooltip } from 'contexts/Tooltip';
import { Wrapper } from './Wrapper';

export const Tooltip = () => {
  const tooltip = useTooltip();
  const { position } = tooltip;

  const ref = useRef(null);

  useEffect(() => {
    if (tooltip.open === 1) {
      tooltip.checkTooltipPosition(ref);
      window.addEventListener('mousemove', mouseMoveCallback);
    } else {
      window.removeEventListener('mousemove', mouseMoveCallback);
    }
    return () => {
      window.removeEventListener('mousemove', mouseMoveCallback);
    };
  }, [tooltip.open]);

  const mouseMoveCallback = (e: any) => {
    const isTriggerElement = e.target?.classList.contains(
      'tooltip-trigger-element'
    );
    if (!isTriggerElement) {
      tooltip.closeTooltip();
    }
  };

  return (
    <>
      {tooltip.open === 1 && (
        <Wrapper
          className="tooltip-trigger-element"
          ref={ref}
          style={{
            position: 'absolute',
            left: `${position[0]}px`,
            top: `${position[1]}px`,
            zIndex: 99,
            opacity: tooltip.show === 1 ? 1 : 0,
          }}
        >
          <h3 className="tooltip-trigger-element">{tooltip.text}</h3>
        </Wrapper>
      )}
    </>
  );
};

export default Tooltip;
