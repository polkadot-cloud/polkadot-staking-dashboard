// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useValidators } from 'contexts/Validators/ValidatorEntries';
import { MaxEraRewardPointsEras } from 'consts';
import { useTooltip } from 'contexts/Tooltip';

export const Quartile = ({ address }: { address: string }) => {
  // const { t } = useTranslation('library');
  const { setTooltipTextAndOpen } = useTooltip();
  const { validatorEraPointsHistory, erasRewardPointsFetched } =
    useValidators();

  const quartile = validatorEraPointsHistory[address]?.quartile;
  const tooltipText = `${MaxEraRewardPointsEras} Day Performance Standing`;

  const quartiles: Record<number, string> = {
    1: '25%',
    2: '50%',
    3: '75%',
    4: '100%',
  };
  const quartileText: string = quartiles[quartile || 4];

  if (erasRewardPointsFetched !== 'synced') return null;

  return (
    <div
      className="label tooltip-trigger-element"
      data-tooltip-text={tooltipText}
      onMouseMove={() => setTooltipTextAndOpen(tooltipText)}
      style={{ cursor: 'default' }}
    >
      {![4, undefined].includes(quartile) ? ` Top ${quartileText}` : ``}
    </div>
  );
};
