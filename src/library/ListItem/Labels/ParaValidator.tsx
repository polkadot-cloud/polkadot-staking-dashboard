// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faCubes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTooltip } from 'contexts/Tooltip';
import { useValidators } from 'contexts/Validators';
import { TooltipPosition, TooltipTrigger } from 'library/ListItem/Wrappers';
import { useRef } from 'react';
import { ParaValidatorProps } from '../types';

export const ParaValidator = ({ address }: ParaValidatorProps) => {
  const { sessionParachain } = useValidators();
  const { setTooltipPosition, setTooltipMeta, open } = useTooltip();

  const posRef = useRef(null);

  const tooltipText = 'Validating Parachain Blocks';

  const toggleTooltip = () => {
    if (!open) {
      setTooltipMeta(tooltipText);
      setTooltipPosition(posRef);
    }
  };

  if (!sessionParachain?.includes(address || '')) {
    return <></>;
  }

  return (
    <div className="label">
      <TooltipTrigger
        className="tooltip-trigger-element"
        data-tooltip-text={tooltipText}
        onMouseMove={() => toggleTooltip()}
      />
      <TooltipPosition ref={posRef} />
      <FontAwesomeIcon icon={faCubes} transform="shrink-1" />
    </div>
  );
};
