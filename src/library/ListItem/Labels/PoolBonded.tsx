// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { planckToUnit, rmCommas } from '@w3ux/utils';
import BigNumber from 'bignumber.js';
import { useNetwork } from 'contexts/Network';
import type { Pool } from 'library/Pool/types';
import { TooltipTrigger } from '../Wrappers';
import { useTranslation } from 'react-i18next';
import { useTooltip } from 'contexts/Tooltip';

export const PoolBonded = ({ pool }: { pool: Pool }) => {
  const { t } = useTranslation('library');
  const {
    networkData: {
      units,
      brand: { inline },
    },
  } = useNetwork();
  const { setTooltipTextAndOpen } = useTooltip();

  const tooltipText = t('bonded');

  const { points } = pool;
  const TokenIcon = inline.svg;

  // Format total bonded pool amount.
  const bonded = planckToUnit(new BigNumber(rmCommas(points)), units);

  return (
    <div className="label pool">
      <TooltipTrigger
        className="tooltip-trigger-element"
        data-tooltip-text={tooltipText}
        onMouseMove={() => setTooltipTextAndOpen(tooltipText)}
      />

      <TokenIcon height="1rem" style={{ marginRight: '0.25rem' }} />
      {bonded.decimalPlaces(0).toFormat()}
    </div>
  );
};
