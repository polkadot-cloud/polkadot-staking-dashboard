// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';
import { useOverlay } from '@polkadot-cloud/react/hooks';

export const JoinPool = ({
  id,
  setActiveTab,
}: {
  id: number;
  setActiveTab: (t: number) => void;
}) => {
  const { t } = useTranslation('library');
  const { openModal } = useOverlay().modal;

  return (
    <div className="label button-with-text">
      <button
        type="button"
        onClick={() => {
          openModal({
            key: 'JoinPool',
            options: {
              id,
              setActiveTab,
            },
            size: 'sm',
          });
        }}
      >
        {t('join')}
        <FontAwesomeIcon icon={faCaretRight} transform="shrink-2" />
      </button>
    </div>
  );
};
