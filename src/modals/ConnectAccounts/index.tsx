// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Wrapper, Separator } from './Wrapper';
import { useConnect } from '../../contexts/Connect';
import { useModal } from '../../contexts/Modal';
import Identicon from '../../library/Identicon';
import { getWallets } from '@talisman-connect/wallets';
import { ReactComponent as TalismanSVG } from '../../img/talisman_icon.svg';
import { ReactComponent as PolkadotJSSVG } from '../../img/dot_icon.svg';

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

  // TODO: display UX if no wallets are supported, link to their extensions
  const supportedWallets = getWallets();

  return (
    <Wrapper>
      {activeWallet === null &&
        <>
          <h2>Select Wallet</h2>
          {supportedWallets.map((wallet: any) => {
            const error = walletErrors[wallet.extensionName] ?? null;

            return (
              <button
                key={wallet.extensionName}
                onClick={() => connectToWallet(wallet.extensionName)}
              >
                <div>
                  {wallet.title === 'Talisman' && <TalismanSVG width='1.5rem' height='1.5rem' />}
                  {wallet.title === 'Polkadot.js' && <PolkadotJSSVG width='1.5rem' height='1.5rem' />}
                  &nbsp; {error ? error : wallet.title}
                </div>
                <div></div>
              </button>
            );
          })}
        </>
      }

      {activeWallet !== null &&
        <>
          <h2>Switch Account</h2>
          <button onClick={() => { disconnect(); }}>
            <div>
              <Identicon value={activeAcc?.address} size={26} />
              &nbsp; {activeAcc?.name}
            </div>
            <div>Disconnect</div>
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
        </>
      }
    </Wrapper>
  )
}

export default ConnectAccounts;