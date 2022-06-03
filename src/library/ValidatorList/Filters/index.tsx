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
import { Wrapper } from './Wrapper';
import { Item } from './Item';

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
    <Wrapper>
      <div className="hide-scrollbar">
        <div>
          <div className="category">
            <div className="head">Order</div>
            <div className="items">
              <Item
                label="lowest commission"
                icon={faPercentage}
                transform="grow-4"
                active={validatorOrder === 'commission'}
                onClick={() => handleFilter(orderValidators, 'commission')}
                width={175}
              />
            </div>
          </div>
          <div className="category">
            <div className="head">Exclude</div>
            <div className="items">
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
                active={
                  validatorFilters?.includes('blocked_nominations') ?? false
                }
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
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default Filters;
