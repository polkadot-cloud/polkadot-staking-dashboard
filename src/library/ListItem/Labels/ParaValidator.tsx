// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCubes } from '@fortawesome/free-solid-svg-icons';
import { useTooltip } from 'contexts/Tooltip';
import { TooltipPosition, TooltipTrigger } from 'library/ListItem/Wrappers';
import { useValidators } from 'contexts/Validators';
import { useTranslation } from 'react-i18next';
import { ParaValidatorProps } from '../types';

export const ParaValidator = ({ address }: ParaValidatorProps) => {
  const { sessionParachain } = useValidators();
  const { t } = useTranslation('common');

  if (!sessionParachain?.includes(address || '')) {
    return <></>;
  }
  const { setTooltipPosition, setTooltipMeta, open } = useTooltip();

  const posRef = useRef(null);

  const tooltipText = t('library.validating_parachain_blocks');

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
      <FontAwesomeIcon icon={faCubes} transform="shrink-1" />
    </div>
  );
};
