// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import Identicon from 'library/Identicon';
import { ConnectContextInterface } from 'types/connect';
import { clipAddress } from 'Utils';
import { ReactComponent as TalismanSVG } from 'img/talisman_icon.svg';
import { ReactComponent as PolkadotJSSVG } from 'img/dot_icon.svg';
import { AccountWrapper } from './Wrappers';

export const Account = (props: any) => {
  const { address, meta } = props;
  const label = props.label ?? null;
  const disconnect = props.disconnect ?? false;
  const source = meta?.source ?? null;

  const { connectToAccount, disconnectFromAccount }: any =
    useConnect() as ConnectContextInterface;
  const { setStatus } = useModal();

  const imported = meta !== null;

  return (
    <AccountWrapper
      disabled={meta === null}
      onClick={() => {
        if (imported) {
          if (disconnect) {
            disconnectFromAccount();
          } else {
            connectToAccount(meta);
            setStatus(0);
          }
        }
      }}
    >
      <div>
        <Identicon value={address} size={26} />
        <span className="name">
          &nbsp; {meta?.name ?? clipAddress(address)}
        </span>
      </div>
      {!imported && (
        <div className="label warning" style={{ color: '#a17703' }}>
          Not Imported
        </div>
      )}
      <div className={label === null ? `` : label[0]}>
        {label !== null && label[1]}

        {source === 'talisman' && <TalismanSVG className="icon" />}
        {source === 'polkadot-js' && <PolkadotJSSVG className="icon" />}
      </div>
    </AccountWrapper>
  );
};
