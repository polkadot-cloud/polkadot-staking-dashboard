// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useTooltip } from 'contexts/Tooltip';
import { TooltipTrigger } from 'library/ListItem/Wrappers';
import { useValidators } from 'contexts/Validators/ValidatorEntries';
import { faArrowUpWideShort } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MaxEraRewardPointsEras } from 'consts';

export const Rank = ({ address }: { address: string }) => {
  // const { t } = useTranslation('library');
  const { setTooltipTextAndOpen } = useTooltip();
  const { validatorEraPointsHistory } = useValidators();

  const performanceRank = validatorEraPointsHistory[address]?.rank;
  const tooltipText = `${MaxEraRewardPointsEras} Day Validator Performance Rank`;

  if (!performanceRank) return null;

  return (
    <div
      className="label"
      style={{ opacity: 0.6, fontFamily: 'InterSemiBold, sans-serif' }}
    >
      <TooltipTrigger
        className="tooltip-trigger-element"
        data-tooltip-text={tooltipText}
        onMouseMove={() => setTooltipTextAndOpen(tooltipText)}
      />
      <FontAwesomeIcon
        icon={faArrowUpWideShort}
        transform="shrink-3"
        style={{ marginRight: '0.05rem' }}
      />
      {performanceRank}
    </div>
  );
};
