// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useRef } from 'react';
import { useTooltip } from 'contexts/Tooltip';
import { TooltipPosition, TooltipTrigger } from 'library/ListItem/Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHashtag } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

export const PoolId = (props: { id: number }) => {
  const { id } = props;
  const { t } = useTranslation('common');

  const { setTooltipPosition, setTooltipMeta, open } = useTooltip();
  const posRef = useRef<HTMLDivElement>(null);
  const tooltipText = t('library.pool_id');

  const toggleTooltip = () => {
    if (!open) {
      setTooltipMeta(tooltipText);
      setTooltipPosition(posRef);
    }
  };

  return (
    <div className="label pool">
      <TooltipTrigger
        className="tooltip-trigger-element"
        data-tooltip-text={tooltipText}
        onMouseMove={() => toggleTooltip()}
      />
      <TooltipPosition ref={posRef} />
      <FontAwesomeIcon icon={faHashtag} />
      &nbsp;{id}
    </div>
  );
};
