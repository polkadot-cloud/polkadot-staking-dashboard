// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import Wrapper from './Wrapper';
import { useConnect } from '../../contexts/Connect';
import { useModal } from '../../contexts/Modal';
import Identicon from '@polkadot/react-identicon';

export const ConnectAccounts = () => {

  const { accounts, setActiveAccount } = useConnect();
  const modal = useModal();

  return (
    <Wrapper>
      <h2>Switch Accounts</h2>
      {accounts.map((item: any, index: number) => {

        const { address, name } = item;

        return (
          <button key={`switch_acnt_${index}`} onClick={() => {
            setActiveAccount(address);
            modal.setStatus(2);
          }}>
            <Identicon
              value={address}
              size={26}
              theme="polkadot"
              style={{ marginRight: '0.5rem' }}
            />
            {name}
          </button>
        );
      })}
    </Wrapper>
  )
}

export default ConnectAccounts;