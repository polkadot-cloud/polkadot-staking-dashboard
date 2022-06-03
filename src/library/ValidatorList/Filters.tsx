// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect } from 'react';
import {
  faPercentage,
  faExclamationTriangle,
  faUserSlash,
  faBalanceScaleLeft,
  faClock,
  faUserTag,
} from '@fortawesome/free-solid-svg-icons';
import { useUi } from 'contexts/UI';
import { Container } from 'library/Filter/Container';
import { Category } from 'library/Filter/Category';
import { Item } from 'library/Filter/Item';

export const Filters = () => {
  const {
    validatorOrder,
    validatorFilters,
    orderValidators,
    toggleFilterValidators,
  }: any = useUi();

  const handleFilter = (fn: any, filter: string) => {
    fn(filter);
  };

  // scroll to top of the window on every filter.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [validatorFilters]);

  return (
    <Container>
      <Category title="Order">
        <Item
          label="lowest commission"
          icon={faPercentage}
          transform="grow-4"
          active={validatorOrder === 'commission'}
          onClick={() => handleFilter(orderValidators, 'commission')}
          width={175}
        />
      </Category>
      <Category title="Exclude">
        <Item
          label="inactive validators"
          icon={faClock}
          transform="grow-4"
          active={validatorFilters?.includes('inactive') ?? false}
          onClick={() => {
            handleFilter(toggleFilterValidators, 'inactive');
          }}
          width={170}
        />
        <Item
          label="over subscribed"
          icon={faExclamationTriangle}
          transform="grow-4"
          active={validatorFilters?.includes('over_subscribed') ?? false}
          onClick={() => {
            handleFilter(toggleFilterValidators, 'over_subscribed');
          }}
          width={155}
        />
        <Item
          label="100% commission"
          icon={faBalanceScaleLeft}
          transform="grow-2"
          active={validatorFilters?.includes('all_commission') ?? false}
          onClick={() => {
            handleFilter(toggleFilterValidators, 'all_commission');
          }}
          width={170}
        />
        <Item
          label="blocked nominations"
          icon={faUserSlash}
          transform="grow-1"
          active={validatorFilters?.includes('blocked_nominations') ?? false}
          onClick={() => {
            handleFilter(toggleFilterValidators, 'blocked_nominations');
          }}
          width={190}
        />
        <Item
          label="missing identity"
          icon={faUserTag}
          transform="grow-2"
          active={validatorFilters?.includes('missing_identity') ?? false}
          onClick={() => {
            handleFilter(toggleFilterValidators, 'missing_identity');
          }}
          width={160}
        />
      </Category>
    </Container>
  );
};

export default Filters;
