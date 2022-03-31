// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Wrapper } from './Wrapper';
import { Item } from './Item';
import { faPercentage, faStopCircle, faUserSlash, faBalanceScaleLeft } from '@fortawesome/free-solid-svg-icons';
import { useUi } from '../../../contexts/UI';

export const Filters = () => {

  const { validators: validatorsUi, setValidatorsOrder }: any = useUi();

  return (
    <Wrapper>
      <div className='section'>
        <div className='head'>Order</div>
        <div className='items'>
          <Item
            label='lowest commission'
            icon={faPercentage}
            transform='grow-12'
            active={validatorsUi.orderBy === 'commission'}
            onClick={() => setValidatorsOrder()}
          />
        </div>
      </div>

      <div className='separator'></div>
      <div className='section'>
        <div className='head'>Filter</div>
        <div className='items'>
          <Item
            label='over subscribed'
            icon={faStopCircle}
            transform='grow-10'
            active={false}
            onClick={() => { }}
          />
          <Item
            label='100% commission'
            icon={faBalanceScaleLeft}
            transform='grow-6'
            active={false}
            onClick={() => { }}
          />
          <Item
            label='blocked nominations'
            icon={faUserSlash}
            transform='grow-9'
            active={false}
            onClick={() => { }}
          />
        </div>
      </div>
    </Wrapper>
  )
}

export default Filters;