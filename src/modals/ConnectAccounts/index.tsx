// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import Wrapper from './Wrapper';
import { useConnect } from '../../contexts/Connect';
import { useModal } from '../../contexts/Modal';
import Identicon from '../../library/Identicon';

export const ConnectAccounts = () => {

  const { accounts, setActiveAccount } = useConnect();
  const modal = useModal();

  return (
    <Wrapper>
      <h2>Choose Stash Account</h2>
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
            />
            &nbsp; {name}
          </button>
        );
      })}
    </Wrapper>
  )
}

export default ConnectAccounts;