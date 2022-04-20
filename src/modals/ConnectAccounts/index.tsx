// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Wrapper, Separator } from './Wrapper';
import { useConnect } from '../../contexts/Connect';
import { useModal } from '../../contexts/Modal';
import Identicon from '../../library/Identicon';

export const ConnectAccounts = () => {

  const modal = useModal();
  let { accounts, getAccount, setActiveAccount, activeAccount, disconnect } = useConnect();

  accounts = accounts.filter((item: any) => item.address !== activeAccount);
  const activeAcc = getAccount(activeAccount);

  return (
    <Wrapper>
      <h2>Choose Stash Account</h2>

      <button onClick={() => {
        modal.setStatus(2);
        disconnect();
      }}>
        <div>
          <Identicon
            value={activeAcc?.address}
            size={26}
          />
          &nbsp; {activeAcc?.name}
        </div>
        <div>
          Disconnect
        </div>
      </button>

      <Separator />

      {accounts.map((item: any, index: number) => {
        const { address, name } = item;

        return (
          <button key={`switch_acnt_${index}`} onClick={() => {
            setActiveAccount(address);
            modal.setStatus(2);
          }}>
            <div>
              <Identicon
                value={address}
                size={26}
              />
              &nbsp; {name}
            </div>
            <div>
            </div>
          </button>
        );
      })}
    </Wrapper>
  )
}

export default ConnectAccounts;