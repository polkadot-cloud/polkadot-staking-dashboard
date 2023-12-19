// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCubes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';
import { useTooltip } from 'contexts/Tooltip';
import { useValidators } from 'contexts/Validators/ValidatorEntries';
import { TooltipTrigger } from 'library/ListItem/Wrappers';
import type { ParaValidatorProps } from '../types';

export const ParaValidator = ({ address }: ParaValidatorProps) => {
  const { t } = useTranslation('library');
  const { sessionParaValidators } = useValidators();
  const { setTooltipTextAndOpen } = useTooltip();

  const tooltipText = t('validatingParachainBlocks');

  if (!sessionParaValidators?.includes(address || '')) {
    return null;
  }

  return (
    <div className="label">
      <TooltipTrigger
        className="tooltip-trigger-element"
        data-tooltip-text={tooltipText}
        onMouseMove={() => setTooltipTextAndOpen(tooltipText)}
      />
      <FontAwesomeIcon icon={faCubes} transform="shrink-1" />
    </div>
  );
};
