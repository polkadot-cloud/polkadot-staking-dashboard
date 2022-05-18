// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Separator } from './Wrapper';
import { useConnect } from '../../contexts/Connect';
import { useModal } from '../../contexts/Modal';
import Identicon from '../../library/Identicon';

export const Accounts = (props: any) => {
  const { setSection } = props;

  const modal = useModal();

  const {
    getAccount,
    connectToAccount,
    disconnectFromAccount,
    activeAccount,
  }: any = useConnect();

  let { accounts } = useConnect();

  const activeAccountMeta = getAccount(activeAccount);

  // remove active account from connect list
  accounts = accounts.filter((item: any) => item.address !== activeAccount);

  return (
    <>
      <h2>
        {activeAccount === '' ? 'Select' : 'Switch'}
        {' '}
        Account
      </h2>
      <div className="head">
        <button
          type="button"
          onClick={() => setSection(0)}
        >
          <FontAwesomeIcon icon={faChevronLeft} transform="shrink-5" />
          &nbsp;Back to Wallets
        </button>
      </div>

      {activeAccount !== ''
        ? (
          <button
            type="button"
            className="item"
            onClick={() => { disconnectFromAccount(); }}
          >
            <div>
              <Identicon value={activeAccountMeta?.address} size={26} />
            &nbsp;
              {' '}
              {activeAccountMeta?.meta?.name}
            </div>
            <div className="danger">Disconnect </div>
          </button>
        )
        : (
          <button
            type="button"
            className="item"
            disabled
          >
            <div>No Account Connected</div>
            <div />
          </button>
        )}
      <Separator />

      {accounts.map((item: any, index: number) => {
        const { address, meta } = item;
        const { name } = meta;

        return (
          <button
            type="button"
            className="item"
            key={`switch_acnt_${index}`}
            onClick={() => {
              connectToAccount(item);
              modal.setStatus(2);
            }}
          >
            <div>
              <Identicon value={address} size={26} />
              &nbsp;
              {' '}
              {name}
            </div>
            <div />
          </button>
        );
      })}
    </>
  );
};

export default Accounts;
