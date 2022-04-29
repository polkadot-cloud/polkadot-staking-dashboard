// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Wrapper } from './Wrapper';
import { Item } from './Item';
import { faPercentage, faExclamationTriangle, faUserSlash, faBalanceScaleLeft, faClock } from '@fortawesome/free-solid-svg-icons';
import { useUi } from '../../../contexts/UI';

export const Filters = (props: any) => {

  const { setInitial } = props;
  const { validatorOrder, validatorFilters, orderValidators, toggleFilterValidators }: any = useUi();

  const handleFilter = (fn: any, filter: string) => {
    setInitial(true);
    fn(filter);
  }

  return (
    <Wrapper>
      <div className='section'>
        <div className='head'>Order</div>
        <div className='items'>
          <Item
            label='lowest commission'
            icon={faPercentage}
            transform='grow-12'
            active={validatorOrder === 'commission'}
            onClick={() => handleFilter(orderValidators, 'commission')}
          />
        </div>
      </div>

      <div className='separator'></div>
      <div className='section'>
        <div className='head'>Exclude</div>
        <div className='items'>
          <Item
            label='inactive validators'
            icon={faClock}
            transform='grow-10'
            active={validatorFilters?.includes('inactive') ?? false}
            onClick={() => {
              handleFilter(toggleFilterValidators, 'inactive');
            }}
          />
          <Item
            label='over subscribed'
            icon={faExclamationTriangle}
            transform='grow-10'
            active={validatorFilters?.includes('over_subscribed') ?? false}
            onClick={() => {
              handleFilter(toggleFilterValidators, 'over_subscribed');
            }}
          />
          <Item
            label='100% commission'
            icon={faBalanceScaleLeft}
            transform='grow-6'
            active={validatorFilters?.includes('all_commission') ?? false}
            onClick={() => {
              handleFilter(toggleFilterValidators, 'all_commission');
            }}
          />
          <Item
            label='blocked nominations'
            icon={faUserSlash}
            transform='grow-9'
            active={validatorFilters?.includes('blocked_nominations') ?? false}
            onClick={() => {
              handleFilter(toggleFilterValidators, 'blocked_nominations');
            }}
          />
        </div>
      </div>
    </Wrapper>
  )
}

export default Filters;