// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  faCog,
  faProjectDiagram,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonSecondary } from '@rossbulat/polkadot-dashboard-ui';
import { useApi } from 'contexts/Api';
import { useBalances } from 'contexts/Balances';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { usePoolMemberships } from 'contexts/Pools/PoolMemberships';
import { PoolMembership } from 'contexts/Pools/types';
import { forwardRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnyJson } from 'types';
import { AccountButton, AccountElement } from './Account';
import { AccountNominating } from './types';
import {
  AccountGroupWrapper,
  AccountWrapper,
  ContentWrapper,
  PaddingWrapper,
} from './Wrappers';

export const Accounts = forwardRef(({ setSection }: AnyJson, ref: AnyJson) => {
  const { t } = useTranslation('modals');
  const { isReady } = useApi();
  const { getAccount, activeAccount } = useConnect();
  const { getAccountLocks, accounts: balanceAccounts, ledgers } = useBalances();
  const { connectToAccount } = useConnect();
  const { setStatus } = useModal();
  const { accounts } = useConnect();
  const { memberships } = usePoolMemberships();

  const stashes: Array<string> = [];

  // store local copy of accounts
  const [localAccounts, setLocalAccounts] = useState(accounts);

  // store accounts that are actively newNominating.
  const [nominating, setNominating] = useState<Array<AccountNominating>>([]);
  const [inPool, setInPool] = useState<Array<PoolMembership>>([]);
  const [notStaking, setNotStaking] = useState<string[]>([]);

  useEffect(() => {
    setLocalAccounts(accounts);
  }, [isReady, accounts]);

  useEffect(() => {
    getAccountsStatus();
  }, [localAccounts, balanceAccounts, ledgers, accounts, memberships]);

  const getAccountsStatus = () => {
    // accumulate imported stash accounts
    for (const account of localAccounts) {
      const locks = getAccountLocks(account.address);

      // account is a stash if they have an active `staking` lock
      const activeLocks = locks.find((l) => {
        const { id } = l;
        return id.trim() === 'staking';
      });
      if (activeLocks !== undefined) {
        stashes.push(account.address);
      }
    }

    // construct account groupings
    const newNominating: Array<AccountNominating> = [];
    const newInPool: Array<PoolMembership> = [];
    const newNotStaking: string[] = [];

    for (const account of localAccounts) {
      const stash = stashes[stashes.indexOf(account.address)] ?? null;

      const poolMember =
        memberships.find(
          (m: PoolMembership) => m.address === account.address
        ) ?? null;

      if (stash) {
        const applied =
          newNominating.find(
            (a: AccountNominating) => a.stash === account.address
          ) !== undefined;

        if (!applied) {
          newNominating.push({
            stash: account.address,
            stashImported: true,
          });
        }
      }

      // if pooling, add to active pooling
      if (poolMember) {
        if (!newInPool.includes(poolMember)) {
          newInPool.push(poolMember);
        }
      }

      // if not doing anything, add to notStaking
      if (!stash && !poolMember) {
        if (!newNotStaking.includes(account.address)) {
          newNotStaking.push(account.address);
        }
      }
    }
    setNominating(newNominating);
    setInPool(newInPool);
    setNotStaking(newNotStaking);
  };

  return (
    <ContentWrapper>
      <PaddingWrapper ref={ref}>
        <div className="head">
          <div>
            <h1>{t('accounts')}</h1>
          </div>
          <div>
            <ButtonSecondary
              text={t('extensions')}
              iconLeft={faCog}
              iconTransform="shrink-2"
              onClick={() => setSection(0)}
            />
          </div>
        </div>
        {activeAccount ? (
          <AccountButton
            address={activeAccount}
            meta={getAccount(activeAccount)}
            label={['danger', t('disconnect')]}
            disconnect
          />
        ) : (
          <AccountWrapper>
            <div>
              <div>
                <h3>{t('noAccountConnected')}</h3>
              </div>
              <div />
            </div>
          </AccountWrapper>
        )}
        {nominating.length ? (
          <>
            <h3 className="heading">
              <FontAwesomeIcon icon={faProjectDiagram} transform="shrink-4" />{' '}
              {t('nominating')}
            </h3>
            {nominating.map((item: AccountNominating, i: number) => {
              const { stash } = item;
              const stashAccount = getAccount(stash);

              return (
                <AccountGroupWrapper
                  key={`active_staking_${i}`}
                  onClick={() => {
                    if (stashAccount) {
                      connectToAccount(stashAccount);
                      setStatus(2);
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
                </AccountGroupWrapper>
              );
            })}
          </>
        ) : null}

        {inPool.length ? (
          <>
            <h3 className="heading">
              <FontAwesomeIcon icon={faUsers} transform="shrink-4" />{' '}
              {t('inPool')}
            </h3>
            {inPool.map((item: PoolMembership, i: number) => {
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
        ) : null}

        {notStaking.length ? (
          <>
            <h3 className="heading">{t('notStaking')}</h3>
            {notStaking.map((item: string, i: number) => {
              const account = getAccount(item);
              const address = account?.address ?? '';

              return (
                <AccountButton
                  address={address}
                  meta={account}
                  key={`not_staking_${i}`}
                />
              );
            })}
          </>
        ) : null}
      </PaddingWrapper>
    </ContentWrapper>
  );
});
