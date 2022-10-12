// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useTranslation } from 'react-i18next';
import { PaginationWrapper } from '.';
import { PaginationProps } from './types';

export const Pagination = (props: PaginationProps) => {
  const { page, total, setter } = props;
  const { t } = useTranslation('common');

  const next = page + 1 > total ? total : page + 1;
  const prev = page - 1 < 1 ? 1 : page - 1;

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
