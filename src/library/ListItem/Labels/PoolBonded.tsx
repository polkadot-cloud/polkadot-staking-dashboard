// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { rmCommas } from '@w3ux/utils';
import BigNumber from 'bignumber.js';
import { useNetwork } from 'contexts/Network';
import type { Pool } from 'library/Pool/types';
import { TooltipTrigger } from '../Wrappers';
import { useTranslation } from 'react-i18next';
import { useTooltip } from 'contexts/Tooltip';
import { planckToUnitBn } from 'Utils';

export const PoolBonded = ({ pool }: { pool: Pool }) => {
  const { t } = useTranslation('library');
  const {
    networkData: {
      units,
      brand: { token },
    },
  } = useNetwork();
  const { setTooltipTextAndOpen } = useTooltip();

  const tooltipText = t('bonded');

  const { points } = pool;
  const TokenIcon = token;

  // Format total bonded pool amount.
  const bonded = planckToUnitBn(new BigNumber(rmCommas(points)), units);

  return (
    <div className="label pool">
      <TooltipTrigger
        className="tooltip-trigger-element"
        data-tooltip-text={tooltipText}
        onMouseMove={() => setTooltipTextAndOpen(tooltipText)}
      />

      <TokenIcon
        style={{ maxWidth: '1.25rem', height: '1.25rem' }}
        className="token"
      />
      {bonded.decimalPlaces(0).toFormat()}
    </div>
  );
};
