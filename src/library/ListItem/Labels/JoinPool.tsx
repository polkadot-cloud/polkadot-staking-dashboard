// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';
import { useOverlay } from 'kits/Overlay/Provider';

export const JoinPool = ({
  id,
  setActiveTab,
  disabled,
}: {
  id: number;
  setActiveTab: (t: number) => void;
  disabled: boolean;
}) => {
  const { t } = useTranslation('tips');
  const { openCanvas } = useOverlay().canvas;

  return (
    <div className="label button-with-text">
      <button
        type="button"
        onClick={() => {
          openCanvas({
            key: 'JoinPool',
            options: {
              providedPool: {
                id,
                performanceBatchKey: 'pool_page',
              },
              onJoinCallback: () => setActiveTab(0),
            },
            size: 'xl',
          });
        }}
        disabled={disabled}
      >
        {t('module.more')}
        <FontAwesomeIcon icon={faCaretRight} transform="shrink-2" />
      </button>
    </div>
  );
};
