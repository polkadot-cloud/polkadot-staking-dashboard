// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { MinBondPrecision } from 'consts';
import { useTooltip } from 'contexts/Tooltip';
import {
  OverSubscribedWrapper,
  TooltipTrigger,
} from 'library/ListItem/Wrappers';
import { useStaking } from 'contexts/Staking';
import { useNetwork } from 'contexts/Network';
import type { OversubscribedProps } from '../types';

export const Oversubscribed = ({ address }: OversubscribedProps) => {
  const { t } = useTranslation('library');
  const {
    networkData: { unit },
  } = useNetwork();
  const { setTooltipTextAndOpen } = useTooltip();
  const { erasStakersSyncing, getLowestRewardFromStaker } = useStaking();

  const { lowest, oversubscribed } = getLowestRewardFromStaker(address);

  const displayOversubscribed = !erasStakersSyncing && oversubscribed;

  const lowestRewardFormatted = lowest
    .decimalPlaces(MinBondPrecision)
    .toFormat();

  const tooltipText = `${t(
    'overSubscribedMinReward'
  )} ${lowestRewardFormatted} ${unit}`;

  return (
    displayOversubscribed && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.1 }}
      >
        <div className="label warning">
          <TooltipTrigger
            className="tooltip-trigger-element"
            data-tooltip-text={tooltipText}
            onMouseMove={() => setTooltipTextAndOpen(tooltipText)}
          />
          <OverSubscribedWrapper>
            <span className="warning">
              <FontAwesomeIcon
                icon={faExclamationTriangle}
                transform="shrink-2"
                className="warning"
              />
            </span>
            {lowestRewardFormatted} {unit}
          </OverSubscribedWrapper>
        </div>
      </motion.div>
    )
  );
};
