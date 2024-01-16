// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PaginationWrapper } from '.';
import type { PaginationProps } from './types';

export const Pagination = ({
  page,
  total,
  setter,
  disabled = false,
}: PaginationProps) => {
  const { t } = useTranslation('library');
  const [next, setNext] = useState<number>(page + 1 > total ? total : page + 1);
  const [prev, setPrev] = useState<number>(page - 1 < 1 ? 1 : page - 1);

  useEffect(() => {
    setNext(page + 1 > total ? total : page + 1);
    setPrev(page - 1 < 1 ? 1 : page - 1);
  }, [page, total]);

  const prevActive = page !== 1;
  const nextActive = page !== total;

  return (
    <PaginationWrapper $prev={prevActive} $next={nextActive}>
      <div>
        <h4>{t('page', { page, total })}</h4>
      </div>
      <div>
        <button
          type="button"
          className="prev"
          onClick={() => {
            setter(prev);
          }}
          disabled={disabled || !prevActive}
        >
          {t('prev')}
        </button>
        <button
          type="button"
          className="next"
          onClick={() => {
            setter(next);
          }}
          disabled={disabled || !nextActive}
        >
          {t('next')}
        </button>
      </div>
    </PaginationWrapper>
  );
};
