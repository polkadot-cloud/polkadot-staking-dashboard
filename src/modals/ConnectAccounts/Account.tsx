// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import Identicon from 'library/Identicon';
import { ConnectContextInterface } from 'types/connect';
import { clipAddress } from 'Utils';
import { ReactComponent as TalismanSVG } from 'img/talisman_icon.svg';
import { ReactComponent as PolkadotJSSVG } from 'img/dot_icon.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { AccountWrapper } from './Wrappers';

export const AccountElement = (props: any) => {
  return (
    <AccountWrapper>
      <div>
        <AccountInner {...props} />
      </div>
    </AccountWrapper>
  );
};

export const AccountButton = (props: any) => {
  const { meta } = props;
  const disconnect = props.disconnect ?? false;
  const { connectToAccount, disconnectFromAccount }: any =
    useConnect() as ConnectContextInterface;
  const { setStatus } = useModal();

  const imported = meta !== null;

  return (
    <AccountWrapper>
      <button
        type="button"
        disabled={!disconnect && !imported}
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
        <AccountInner {...props} />
      </button>
    </AccountWrapper>
  );
};

export const AccountInner = (props: any) => {
  const { address, meta } = props;
  const label = props.label ?? null;
  const source = meta?.source ?? null;
  const imported = meta !== null && source !== 'external';

  return (
    <>
      <div>
        <Identicon value={address ?? ''} size={26} />
        <span className="name">
          &nbsp; {meta?.name ?? clipAddress(address ?? '')}
        </span>
      </div>
      {!imported && (
        <div
          className="label warning"
          style={{ color: '#a17703', paddingLeft: '0.5rem' }}
        >
          Not Imported
        </div>
      )}

      <div className={label === null ? `` : label[0]}>
        {label !== null && <h5>{label[1]}</h5>}

        {source === 'talisman' && <TalismanSVG className="icon" />}
        {source === 'polkadot-js' && <PolkadotJSSVG className="icon" />}
        {!imported && (
          <FontAwesomeIcon
            icon={faExclamationTriangle as IconProp}
            className="icon"
            style={{ opacity: 0.2 }}
          />
        )}
      </div>
    </>
  );
};
