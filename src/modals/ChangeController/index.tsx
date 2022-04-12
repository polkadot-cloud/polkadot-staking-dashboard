// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState } from 'react';
import Wrapper from './Wrapper';
import { useConnect } from '../../contexts/Connect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons';
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import { AccountDropdown } from '../../library/Form/AccountDropdown';
import { useBalances } from '../../contexts/Balances';

export const ChangeController = () => {

  const { accounts, activeAccount, getAccount } = useConnect();
  const { getBondedAccount }: any = useBalances();
  const controller = getBondedAccount(activeAccount);
  const account = getAccount(controller);

  const [selected, setSelected] = useState(account);

  const handleOnChange = (selected: any) => {
    setSelected(selected);
  }

  return (
    <Wrapper>
      <h3>
        <FontAwesomeIcon transform='grow-2' icon={faExchangeAlt} />
        Change Controller Account
      </h3>
      <AccountDropdown
        items={accounts.filter((acc: any) => acc.address !== activeAccount)}
        onChange={handleOnChange}
        placeholder='Select Account'
        value={selected}
        height='17rem'
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