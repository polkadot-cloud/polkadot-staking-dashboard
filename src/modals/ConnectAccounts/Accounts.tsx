// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { forwardRef } from 'react';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { useConnect } from 'contexts/Connect';
import Identicon from 'library/Identicon';
import { useModal } from 'contexts/Modal';
import { ConnectContextInterface } from 'types/connect';
import Button from 'library/Button';
import {
  Separator,
  ContentWrapper,
  PaddingWrapper,
  AccountWrapper,
} from './Wrappers';

export const Accounts = forwardRef((props: any, ref: any) => {
  const { setSection } = props;

  const {
    getAccount,
    connectToAccount,
    disconnectFromAccount,
    activeAccount,
  }: any = useConnect() as ConnectContextInterface;
  const { setStatus } = useModal();
  const { activeExtension } = useConnect() as ConnectContextInterface;
  let { accounts } = useConnect() as ConnectContextInterface;

  const activeAccountMeta = getAccount(activeAccount);

  // filter accounts by extension name
  accounts = accounts.filter((item: any) => item.source === activeExtension);

  // remove active account from connect list
  accounts = accounts.filter((item: any) => item.address !== activeAccount);

  return (
    <ContentWrapper>
      <PaddingWrapper ref={ref}>
        <h2>Select Account</h2>
        <div className="head">
          <Button
            title="Back"
            primary
            icon={faChevronLeft}
            transform="shrink-2"
            onClick={() => setSection(0)}
          />
        </div>

        {activeAccount ? (
          <AccountWrapper
            onClick={() => {
              disconnectFromAccount();
            }}
          >
            <div>
              <Identicon value={activeAccountMeta?.address} size={26} />
              <span className="name">&nbsp; {activeAccountMeta?.name}</span>
            </div>
            <div className="danger">Disconnect</div>
          </AccountWrapper>
        ) : (
          <AccountWrapper disabled>
            <div>No Account Connected</div>
            <div />
          </AccountWrapper>
        )}
        <Separator />

        {accounts.map((item: any, index: number) => {
          const { address, name } = item;
          return (
            <AccountWrapper
              key={`switch_acnt_${index}`}
              onClick={() => {
                connectToAccount(item);
                setStatus(0);
              }}
            >
              <div>
                <Identicon value={address} size={26} />
                <span className="name">&nbsp; {name}</span>
              </div>
              <div />
            </AccountWrapper>
          );
        })}
      </PaddingWrapper>
    </ContentWrapper>
  );
});

export default Accounts;
