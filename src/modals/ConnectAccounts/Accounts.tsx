// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { forwardRef } from 'react';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { useConnect } from 'contexts/Connect';
import Identicon from 'library/Identicon';
import { useModal } from 'contexts/Modal';
import { ConnectContextInterface } from 'types/connect';
import Button from 'library/Button';
import { useBalances } from 'contexts/Balances';
import { useActivePool } from 'contexts/Pools/ActivePool';
import { ActivePoolContextState } from 'types/pools';
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
  const { getAccountLedger, getAccountLocks, getBondedAccount }: any =
    useBalances();
  const { getPoolBondOptions } = useActivePool() as ActivePoolContextState;
  const { activeExtension } = useConnect() as ConnectContextInterface;
  let { accounts } = useConnect() as ConnectContextInterface;
  const activeAccountMeta = getAccount(activeAccount);

  const _controllers: any = [];
  const _stashes: any = [];

  // accumulate imported stash accounts
  for (const account of accounts) {
    const locks = getAccountLocks(account.address);

    // account is a stash if they have an active `staking` lock
    const activeLocks = locks.find((l: any) => {
      const { id }: any = l;
      return id.trim() === 'staking';
    });
    if (activeLocks !== undefined) {
      _stashes.push({
        address: account.address,
        controller: getBondedAccount(account.address),
      });
    }
  }

  // accumulate imported controller accounts
  for (const account of accounts) {
    if (_stashes.find((s: any) => s.controller === account.address)) {
      const ledger = getAccountLedger(account.address);
      _controllers.push({
        address: account.address,
        ledger,
      });
    }
  }

  // construct account groupings
  const activeStaking: any = [];

  for (const account of accounts) {
    const stash = _stashes.find((s: any) => s.address === account.address);

    // if stash, get controller
    if (stash) {
      activeStaking.push({
        stash: account.address,
        controller: stash.controller,
        stashImported: true,
        controlerImported:
          accounts.find((a: any) => a.address === stash.controller) !==
          undefined,
      });
    }

    const controller = _controllers.find(
      (c: any) => c.address === account.address
    );

    // if controller, get stash
    if (controller) {
      const applied =
        activeStaking.find((a: any) => a.controller === account.address) !==
        undefined;

      if (!applied) {
        activeStaking.push({
          stash: controller.ledger.stash,
          controller: controller.address,
          stashImported:
            accounts.find((a: any) => a.address === controller.ledger.stash) !==
            undefined,
          controllerImported: true,
        });
      }
    }

    // if pooling, add to active pooling
    const poolOptions = getPoolBondOptions(account.address);

    // TODO: finish
  }

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

        {activeAccountMeta.source === activeExtension && (
          <>
            {activeAccount ? (
              <AccountWrapper
                onClick={() => {
                  disconnectFromAccount();
                  setSection(0);
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
          </>
        )}

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
