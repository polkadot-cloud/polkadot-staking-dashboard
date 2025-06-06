// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useSyncing } from 'hooks/useSyncing'
import { useTranslation } from 'react-i18next'
import { PageToggleWrapper } from './Wrappers'
import type { PageToggleProps } from './types'

export const PageToggle = ({
  start,
  end,
  page,
  itemsPerPage,
  totalItems,
  setPageHandler,
}: PageToggleProps) => {
  const { t } = useTranslation()
  const { syncing } = useSyncing(['initialization'])

  totalItems = syncing ? 1 : totalItems
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  return (
    <PageToggleWrapper>
      <h4 className={totalPages === 1 ? `disabled` : undefined}>
        <span>
          {start}
          {itemsPerPage > 1 && totalItems > 1 && start !== end && ` - ${end}`}
        </span>
        {totalPages > 1 && (
          <>
            {t('module.of', { ns: 'tips' })}
            <span>{totalItems}</span>
          </>
        )}
      </h4>
      <span>
        <button
          type="button"
          disabled={totalPages === 1 || page === 1}
          onClick={() => {
            setPageHandler(page - 1)
          }}
        >
          <FontAwesomeIcon
            icon={faChevronLeft}
            className="icon"
            transform="shrink-1"
          />
        </button>
      </span>
      <span>
        <button
          type="button"
          disabled={totalPages === 1 || page === totalPages}
          onClick={() => {
            setPageHandler(page + 1)
          }}
        >
          <FontAwesomeIcon
            icon={faChevronRight}
            className="icon"
            transform="shrink-1"
          />
        </button>
      </span>
    </PageToggleWrapper>
  )
}
