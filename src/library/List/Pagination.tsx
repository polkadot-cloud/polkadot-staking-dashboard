// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PaginationWrapper } from '.';
import { PaginationProps } from './types';

export const Pagination = (props: PaginationProps) => {
  const { page, total, setter } = props;

  const next = page + 1 > total ? total : page + 1;
  const prev = page - 1 < 1 ? 1 : page - 1;

  return (
    <PaginationWrapper prev={page !== 1} next={page !== total}>
      <div>
        <h4>
          Page {page} of {total}
        </h4>
      </div>
      <div>
        <button
          type="button"
          className="prev"
          onClick={() => {
            setter(prev);
          }}
        >
          Prev
        </button>
        <button
          type="button"
          className="next"
          onClick={() => {
            setter(next);
          }}
        >
          Next
        </button>
      </div>
    </PaginationWrapper>
  );
};
