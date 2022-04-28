// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState } from 'react';
import { Wrapper } from './Wrapper';
import { HeadingWrapper, FooterWrapper } from '../Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet } from '@fortawesome/free-solid-svg-icons';
import { faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons';
import { Dropdown } from '../../library/Form/Dropdown';
import { useStaking } from '../../contexts/Staking';

export const UpdatePayee = () => {

  const { staking } = useStaking();
  const { payee } = staking;

  const items = [{
    key: 'Staked',
    name: 'Back to Staking'
  }, {
    key: 'Stash',
    name: 'To Stash Account'
  }, {
    key: 'Controller',
    name: 'To Controller Account'
  }];

  const _selected = items.find((item: any) => item.key === payee);
  const [selected, setSelected] = useState(_selected ?? null);

  const handleOnChange = (selected: any) => {
    setSelected(selected);
  }

  // TODO: submit extrinsic
  const submitTx = () => {
  }

  return (
    <Wrapper>
      <HeadingWrapper>
        <FontAwesomeIcon transform='grow-2' icon={faWallet} />
        Update Reward Destination
      </HeadingWrapper>
      <div style={{ padding: '0 1rem', width: '100%', boxSizing: 'border-box' }}>
        <Dropdown
          items={items}
          onChange={handleOnChange}
          placeholder='Reward Destination'
          value={selected}
          height='17rem'
        />
        <FooterWrapper>
          <div>
            <button className='submit' onClick={() => submitTx()} disabled={selected === null}>
              <FontAwesomeIcon transform='grow-2' icon={faArrowAltCircleUp} />
              Submit
            </button>
          </div>
        </FooterWrapper>
      </div>
    </Wrapper>
  )
}

export default UpdatePayee;