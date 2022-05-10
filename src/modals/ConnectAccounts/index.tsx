// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';
import { Wrapper, Separator } from './Wrapper';
import { useConnect } from '../../contexts/Connect';
import { useModal } from '../../contexts/Modal';
import Identicon from '../../library/Identicon';
import { ReactComponent as TalismanSVG } from '../../img/talisman_icon.svg';
import { ReactComponent as PolkadotJSSVG } from '../../img/dot_icon.svg';
import { web3Enable } from '@polkadot/extension-dapp';
import { DAPP_NAME } from '../../constants';

export const ConnectAccounts = () => {

  const modal = useModal();
  const {
    getAccount,
    setActiveAccount,
    disconnect,
    activeWallet,
    activeAccount,
  } = useConnect();

  let { accounts, walletErrors, connectToWallet }: any = useConnect();
  accounts = accounts.filter((item: any) => item.address !== activeAccount);

  const activeAcc = getAccount(activeAccount);

  // store supported extensions
  const [extensions, setExtensions]: any = useState([]);

  // load supported wallets
  useEffect(() => {
    fetchExtensions();
  }, []);

  const fetchExtensions = async () => {
    const allInjected = await web3Enable(DAPP_NAME);
    setExtensions(allInjected);
  }

  return (
    <Wrapper>
      {activeWallet === null &&
        <>
          <h2>Select Wallet</h2>

          {extensions.map((wallet: any) => {
            const error = walletErrors[wallet.name] ?? null;

            return (
              <button
                key={`wallet_${wallet.name}`}
                onClick={() => connectToWallet(wallet.name)}
              >
                <div>
                  {wallet.name === 'talisman' && <TalismanSVG width='1.5rem' height='1.5rem' />}
                  {wallet.name === 'polkadot-js' && <PolkadotJSSVG width='1.5rem' height='1.5rem' />}
                  &nbsp; {error ? error : wallet.name}
                </div>
                <div></div>
              </button>
            )
          })}
        </>
      }

      {activeWallet !== null &&
        <>
          <h2>Switch Account</h2>
          <button onClick={() => { disconnect(); }}>
            <div>
              <Identicon value={activeAcc?.address} size={26} />
              &nbsp; {activeAcc?.meta?.name}
            </div>
            <div>Disconnect</div>
          </button>
          <Separator />
          {accounts.map((item: any, index: number) => {
            const { address, meta } = item;
            const { name } = meta;

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
        </>
      }
    </Wrapper>
  )
}

export default ConnectAccounts;