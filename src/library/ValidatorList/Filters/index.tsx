// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  faPercentage,
  faExclamationTriangle,
  faUserSlash,
  faBalanceScaleLeft,
  faClock,
  faUserTag,
} from '@fortawesome/free-solid-svg-icons';
import { Wrapper } from './Wrapper';
import { Item } from './Item';
import { useUi } from '../../../contexts/UI';

export const Filters = (props: any) => {
  const { setInitial } = props;
  const {
    validatorOrder, validatorFilters, orderValidators, toggleFilterValidators,
  }: any = useUi();

  const handleFilter = (fn: any, filter: string) => {
    setInitial(true);
    fn(filter);
  };

  return (
    <Wrapper>
      <div className="hide-scrollbar">
        <section>
          <div className="category">
            <div className="head">Order</div>
            <div className="items">
              <Item
                label="lowest commission"
                icon={faPercentage}
                transform="grow-10"
                active={validatorOrder === 'commission'}
                onClick={() => handleFilter(orderValidators, 'commission')}
              />
            </div>
          </div>
          <div className="category">
            <div className="head">Exclude</div>
            <div className="items">
              <Item
                label="inactive validators"
                icon={faClock}
                transform="grow-8"
                active={validatorFilters?.includes('inactive') ?? false}
                onClick={() => {
                  handleFilter(toggleFilterValidators, 'inactive');
                }}
              />
              <Item
                label="over subscribed"
                icon={faExclamationTriangle}
                transform="grow-8"
                active={validatorFilters?.includes('over_subscribed') ?? false}
                onClick={() => {
                  handleFilter(toggleFilterValidators, 'over_subscribed');
                }}
              />
              <Item
                label="100% commission"
                icon={faBalanceScaleLeft}
                transform="grow-4"
                active={validatorFilters?.includes('all_commission') ?? false}
                onClick={() => {
                  handleFilter(toggleFilterValidators, 'all_commission');
                }}
              />
              <Item
                label="blocked nominations"
                icon={faUserSlash}
                transform="grow-7"
                active={validatorFilters?.includes('blocked_nominations') ?? false}
                onClick={() => {
                  handleFilter(toggleFilterValidators, 'blocked_nominations');
                }}
              />
              <Item
                label="missing identity"
                icon={faUserTag}
                transform="grow-7"
                active={validatorFilters?.includes('missing_identity') ?? false}
                onClick={() => {
                  handleFilter(toggleFilterValidators, 'missing_identity');
                }}
              />
            </div>
          </div>
        </section>
      </div>
    </Wrapper>
  );
};

export default Filters;
