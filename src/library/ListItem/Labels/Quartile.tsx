// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useValidators } from 'contexts/Validators/ValidatorEntries';
import { MaxEraRewardPointsEras } from 'consts';
import { useTooltip } from 'contexts/Tooltip';
import { useTranslation } from 'react-i18next';

export const Quartile = ({ address }: { address: string }) => {
  const { t } = useTranslation();
  const { setTooltipTextAndOpen } = useTooltip();
  const { validatorEraPointsHistory, erasRewardPointsFetched } =
    useValidators();

  const quartile = validatorEraPointsHistory[address]?.quartile;
  const tooltipText = `${t('dayPerformanceStanding', {
    count: MaxEraRewardPointsEras,
    ns: 'library',
  })}`;

  if (erasRewardPointsFetched !== 'synced') return null;

  return (
    <div
      className="label tooltip-trigger-element"
      data-tooltip-text={tooltipText}
      onMouseMove={() => setTooltipTextAndOpen(tooltipText)}
      style={{ cursor: 'default' }}
    >
      {![100, undefined].includes(quartile)
        ? `${t('top', { ns: 'library' })} ${quartile}%`
        : ``}
    </div>
  );
};
