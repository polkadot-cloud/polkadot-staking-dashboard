// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useTooltip } from 'contexts/Tooltip';
import { TooltipTrigger } from 'library/ListItem/Wrappers';
import { useValidators } from 'contexts/Validators/ValidatorEntries';
import { faHashtag } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MaxEraRewardPointsEras } from 'consts';

export const Rank = ({ address }: { address: string }) => {
  // const { t } = useTranslation('library');
  const { setTooltipTextAndOpen } = useTooltip();
  const { validatorEraPointsHistory, erasRewardPointsFetched } =
    useValidators();

  const performanceRank = validatorEraPointsHistory[address]?.rank;
  const tooltipText = `${MaxEraRewardPointsEras} Day Performance Rank`;

  if (erasRewardPointsFetched !== 'synced') return null;

  return (
    <div className="label">
      <TooltipTrigger
        className="tooltip-trigger-element"
        data-tooltip-text={tooltipText}
        onMouseMove={() => setTooltipTextAndOpen(tooltipText)}
      />
      <FontAwesomeIcon
        icon={faHashtag}
        transform="shrink-3"
        style={{ marginRight: '0.1rem' }}
      />
      {performanceRank || 'Unranked'}
    </div>
  );
};
