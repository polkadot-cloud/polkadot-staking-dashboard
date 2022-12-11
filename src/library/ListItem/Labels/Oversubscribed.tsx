// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useApi } from 'contexts/Api';
import { useTooltip } from 'contexts/Tooltip';
import { useValidators } from 'contexts/Validators';
import { motion } from 'framer-motion';
import {
  OverSubscribedWrapper,
  TooltipPosition,
  TooltipTrigger,
} from 'library/ListItem/Wrappers';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { OversubscribedProps } from '../types';

export const Oversubscribed = (props: OversubscribedProps) => {
  const { consts, network } = useApi();
  const { meta } = useValidators();
  const { setTooltipPosition, setTooltipMeta, open } = useTooltip();
  const { t } = useTranslation('library');

  const { batchIndex, batchKey } = props;

  const identities = meta[batchKey]?.identities ?? [];
  const supers = meta[batchKey]?.supers ?? [];
  const stake = meta[batchKey]?.stake ?? [];

  // aggregate synced status
  const identitiesSynced = identities.length > 0 ?? false;
  const supersSynced = supers.length > 0 ?? false;

  const synced = {
    identities: identitiesSynced && supersSynced,
    stake: stake.length > 0 ?? false,
  };

  const eraStakers = stake[batchIndex];

  const totalNominations = eraStakers?.total_nominations ?? 0;
  const lowestReward = eraStakers?.lowestReward ?? 0;

  const displayOversubscribed =
    synced.stake && totalNominations >= consts.maxNominatorRewardedPerValidator;

  const posRef = useRef(null);

  const tooltipText = `${t('minimum_reward')} ${lowestReward} ${network.unit}`;

  const toggleTooltip = () => {
    if (!open) {
      setTooltipMeta(tooltipText);
      setTooltipPosition(posRef);
    }
  };

  return (
    <>
      {displayOversubscribed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.1 }}
        >
          <div className="label warning">
            <TooltipTrigger
              className="tooltip-trigger-element"
              data-tooltip-text={tooltipText}
              onMouseMove={() => toggleTooltip()}
            />
            <TooltipPosition ref={posRef} />
            <OverSubscribedWrapper>
              <span className="warning">
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  transform="shrink-2"
                  className="warning"
                />
              </span>
              {lowestReward} {network.unit}
            </OverSubscribedWrapper>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default Oversubscribed;
