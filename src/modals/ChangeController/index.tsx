// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import Wrapper from './Wrapper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons';
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import { Dropdown } from '../../library/Dropdown';

export const ChangeController = () => {

  return (
    <Wrapper>
      <h3>
        <FontAwesomeIcon transform='grow-2' icon={faExchangeAlt} />
        Change Controller Account
      </h3>

      <Dropdown
        items={[]}
        onChange={(selected: any) => {
          console.log(selected);
        }}
        label='Select Account'
        placeholder='Account'
      />
      <div className='foot'>
        <div>
          <button className='submit'>
            <FontAwesomeIcon transform='grow-2' icon={faArrowAltCircleUp} />
            Submit
          </button>
        </div>
      </div>
    </Wrapper>
  )
}

export default ChangeController;