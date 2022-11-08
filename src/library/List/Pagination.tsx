// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PaginationWrapper } from '.';
import { PaginationProps } from './types';

export const Pagination = ({ page, total, setter }: PaginationProps) => {
  const [next, setNext] = useState<number>(page + 1 > total ? total : page + 1);
  const [prev, setPrev] = useState<number>(page - 1 < 1 ? 1 : page - 1);
  const { t } = useTranslation('common');

  useEffect(() => {
    setNext(page + 1 > total ? total : page + 1);
    setPrev(page - 1 < 1 ? 1 : page - 1);
  }, [page, total]);

  return (
    <PaginationWrapper prev={page !== 1} next={page !== total}>
      <div>
        <h4>{t('library.page', { page, total })}</h4>
      </div>
      <div>
        <button
          type="button"
          className="prev"
          onClick={() => {
            setter(prev);
          }}
        >
          {t('library.prev')}
        </button>
        <button
          type="button"
          className="next"
          onClick={() => {
            setter(next);
          }}
        >
          {t('library.next')}
        </button>
      </div>
    </PaginationWrapper>
  );
};
