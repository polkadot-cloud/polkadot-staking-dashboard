// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect, forwardRef } from 'react';
import { faCog, faChartLine, faUsers } from '@fortawesome/free-solid-svg-icons';
import { useConnect } from 'contexts/Connect';
import Button from 'library/Button';
import { ConnectContextInterface } from 'types/connect';
import { useBalances } from 'contexts/Balances';
import { PoolMembershipsContextState } from 'types/pools';
import { usePoolMemberships } from 'contexts/Pools/PoolMemberships';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useModal } from 'contexts/Modal';
import { BalancesContextInterface } from 'types/balances';
import { useApi } from 'contexts/Api';
import { APIContextInterface } from 'types/api';
import {
  AccountWrapper,
  AccountGroupWrapper,
  PaddingWrapper,
  ContentWrapper,
} from './Wrappers';
import { AccountElement, AccountButton } from './Account';

export const Accounts = forwardRef((props: any, ref: any) => {
  const { setSection } = props;

  const { isReady } = useApi() as APIContextInterface;
  const { getAccount, activeAccount }: any =
    useConnect() as ConnectContextInterface;
  const { getAccountLedger, getAccountLocks, getBondedAccount, ledgers } =
    useBalances() as BalancesContextInterface;
  const { connectToAccount } = useConnect() as ConnectContextInterface;
  const { setStatus } = useModal();

  const { accounts } = useConnect() as ConnectContextInterface;
  const { memberships } = usePoolMemberships() as PoolMembershipsContextState;

  const _controllers: any = [];
  const _stashes: any = [];

  // store staking statuses
  const [activeStaking, setActiveStaking] = useState<Array<any>>([]);
  const [activePooling, setActivePooling] = useState<Array<any>>([]);
  const [inactive, setInactive] = useState<Array<any>>([]);

  useEffect(() => {
    getStakingStatuses();
  }, [isReady, ledgers, accounts]);

  const getStakingStatuses = () => {
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
      const _stash = _stashes.find(
        (s: any) => s.controller === account.address
      );

      if (_stash) {
        const ledger = getAccountLedger(_stash.address);
        _controllers.push({
          address: account.address,
          ledger,
        });
      }
    }

    // construct account groupings
    const _activeStaking: Array<any> = [];
    const _activePooling: Array<any> = [];
    const _inactive: Array<any> = [];

    for (const account of accounts) {
      const stash = _stashes.find((s: any) => s.address === account.address);
      const controller = _controllers.find(
        (c: any) => c.address === account.address
      );
      const poolMember = memberships.find(
        (m: any) => m.address === account.address
      );

      // if stash, get controller
      if (stash) {
        const applied =
          _activeStaking.find((a: any) => a.stash === account.address) !==
          undefined;

        if (!applied) {
          const _record = {
            stash: account.address,
            controller: stash.controller,
            stashImported: true,
            controllerImported:
              accounts.find((a: any) => a.address === stash.controller) !==
              undefined,
          };
          _activeStaking.push(_record);
        }
      }

      // if controller, get stash
      if (controller) {
        const applied =
          _activeStaking.find((a: any) => a.controller === account.address) !==
          undefined;

        if (!applied) {
          const _record = {
            stash: controller.ledger.stash,
            controller: controller.address,
            stashImported:
              accounts.find(
                (a: any) => a.address === controller.ledger.stash
              ) !== undefined,
            controllerImported: true,
          };
          _activeStaking.push(_record);
        }
      }

      // if pooling, add to active pooling
      if (poolMember) {
        _activePooling.push(poolMember);
      }

      // if not doing anything, add to inactive
      if (!stash && !controller && !poolMember) {
        _inactive.push(account.address);
      }
    }
    setActiveStaking(_activeStaking);
    setActivePooling(_activePooling);
    setInactive(_inactive);
  };

  return (
    <ContentWrapper>
      <PaddingWrapper ref={ref}>
        <div className="head">
          <div>
            <h1>Accounts</h1>
          </div>
          <div>
            <Button
              title="Extensions"
              inline
              icon={faCog}
              transform="shrink-2"
              onClick={() => setSection(0)}
            />
          </div>
        </div>
        {activeAccount ? (
          <AccountButton
            address={activeAccount}
            meta={getAccount(activeAccount)}
            label={['danger', 'Disconnect']}
            disconnect
          />
        ) : (
          <AccountWrapper>
            <div>
              <div>
                <h3>No Account Connected</h3>
              </div>
              <div />
            </div>
          </AccountWrapper>
        )}
        {activeStaking.length > 0 && (
          <>
            <h2>
              <FontAwesomeIcon icon={faChartLine} transform="shrink-4" />{' '}
              Actively Staking
            </h2>
            {activeStaking.map((item: any, i: number) => {
              const { stash, controller } = item;
              const stashAccount = getAccount(stash);
              const controllerAccount = getAccount(controller);

              return (
                <AccountGroupWrapper
                  key={`active_staking_${i}`}
                  onClick={() => {
                    if (stashAccount) {
                      connectToAccount(stashAccount);
                      setStatus(0);
                    }
                  }}
                >
                  <section>
                    <AccountElement
                      address={stash}
                      meta={stashAccount}
                      label={['neutral', 'Stash']}
                      asElement
                    />
                  </section>
                  <section>
                    <AccountElement
                      address={controller}
                      meta={controllerAccount}
                      label={['neutral', 'Controller']}
                      asElement
                    />
                  </section>
                </AccountGroupWrapper>
              );
            })}
          </>
        )}

        {activePooling.length > 0 && (
          <>
            <h2>
              <FontAwesomeIcon icon={faUsers} transform="shrink-4" /> In Pool
            </h2>
            {activePooling.map((item: any, i: number) => {
              const { address } = item;
              const account = getAccount(address);

              return (
                <AccountButton
                  address={address}
                  meta={account}
                  key={`active_pool_${i}`}
                />
              );
            })}
          </>
        )}

        {inactive.length > 0 && (
          <>
            <h2>Not Staking</h2>
            {inactive.map((item: string, i: number) => {
              const account = getAccount(item);
              const { address } = account;

              return (
                <AccountButton
                  address={address}
                  meta={account}
                  key={`not_staking_${i}`}
                />
              );
            })}
          </>
        )}
      </PaddingWrapper>
    </ContentWrapper>
  );
});

export default Accounts;
