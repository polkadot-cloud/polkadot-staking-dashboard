// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  faChevronCircleLeft,
  faChevronCircleRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useUi } from 'contexts/UI';
import { useTranslation } from 'react-i18next';
import { PageToggleProps } from './types';
import { PageToggleWrapper } from './Wrappers';

export const PageToggle = ({
  start,
  end,
  page,
  itemsPerPage,
  totalItems,
  setPageHandler,
}: PageToggleProps) => {
  const { t } = useTranslation();
  const { networkSyncing } = useUi();

  totalItems = networkSyncing ? 1 : totalItems;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <PageToggleWrapper>
      <button
        type="button"
        disabled={totalPages === 1 || page === 1}
        onClick={() => {
          setPageHandler(page - 1);
        }}
      >
        <FontAwesomeIcon
          icon={faChevronCircleLeft}
          className="icon"
          transform="grow-2"
        />
      </button>
      <h4 className={totalPages === 1 ? `disabled` : undefined}>
        <span>
          {start}
          {itemsPerPage > 1 && totalItems > 1 && start !== end && ` - ${end}`}
        </span>
        {totalPages > 1 && (
          <>
            {t('module.of', { ns: 'tips' })} <span>{totalItems}</span>
          </>
        )}
      </h4>
      <button
        type="button"
        disabled={totalPages === 1 || page === totalPages}
        onClick={() => {
          setPageHandler(page + 1);
        }}
      >
        <FontAwesomeIcon
          icon={faChevronCircleRight}
          className="icon"
          transform="grow-2"
        />
      </button>
    </PageToggleWrapper>
  );
};
