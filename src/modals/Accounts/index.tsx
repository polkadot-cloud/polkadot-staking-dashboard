// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { ButtonPrimaryInvert } from '@polkadotcloud/core-ui';
import { useBalances } from 'contexts/Accounts/Balances';
import { useLedgers } from 'contexts/Accounts/Ledgers';
import { useProxies } from 'contexts/Accounts/Proxies';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useExtensions } from 'contexts/Extensions';
import { useModal } from 'contexts/Modal';
import { usePoolMemberships } from 'contexts/Pools/PoolMemberships';
import type { PoolMembership } from 'contexts/Pools/types';
import { Action } from 'library/Modal/Action';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CustomHeaderWrapper, PaddingWrapper } from '../Wrappers';
import { AccountButton } from './Account';
import { Delegates } from './Delegates';
import { AccountSeparator, AccountWrapper } from './Wrappers';
import type {
  AccountInPool,
  AccountNominating,
  AccountNotStaking,
} from './types';

export const Accounts = () => {
  const { t } = useTranslation('modals');
  const { isReady } = useApi();
  const { getAccount, activeAccount } = useConnect();
  const { getAccountLocks, balances } = useBalances();
  const { ledgers } = useLedgers();
  const { accounts } = useConnect();
  const { memberships } = usePoolMemberships();
  const { replaceModalWith, setResize } = useModal();
  const { extensions } = useExtensions();
  const { getDelegates } = useProxies();

  const stashes: Array<string> = [];

  // store local copy of accounts
  const [localAccounts, setLocalAccounts] = useState(accounts);

  // store accounts that are actively newNominating.
  const [nominating, setNominating] = useState<AccountNominating[]>([]);
  const [inPool, setInPool] = useState<AccountInPool[]>([]);
  const [notStaking, setNotStaking] = useState<AccountNotStaking[]>([]);

  useEffect(() => {
    setLocalAccounts(accounts);
  }, [isReady, accounts]);

  useEffect(() => {
    getAccountsStatus();
  }, [localAccounts, balances, ledgers, accounts, memberships]);

  useEffect(() => {
    setResize();
  }, [activeAccount, accounts, balances, ledgers, extensions]);

  const getAccountsStatus = () => {
    // accumulate imported stash accounts
    for (const { address } of localAccounts) {
      const locks = getAccountLocks(address);

      // account is a stash if they have an active `staking` lock
      if (locks.find(({ id }) => id === 'staking')) {
        stashes.push(address);
      }
    }

    // construct account groupings
    const newNominating: AccountNominating[] = [];
    const newInPool: AccountInPool[] = [];
    const newNotStaking: AccountNotStaking[] = [];

    for (const { address } of localAccounts) {
      const isStash = stashes[stashes.indexOf(address)] ?? null;
      const delegates = getDelegates(address);

      const poolMember =
        memberships.find((m: PoolMembership) => m.address === address) ?? null;

      // If stash exists, add address to nominating list.
      if (
        isStash &&
        newNominating.find((a: AccountNominating) => a.address === address) ===
          undefined
      ) {
        newNominating.push({ address, stashImported: true, delegates });
      }

      // if pooling, add address to active pooling.
      if (poolMember) {
        if (!newInPool.find((n: AccountInPool) => n.address === address)) {
          newInPool.push({ ...poolMember, delegates });
        }
      }

      // If not doing anything, add address to `notStaking`.
      if (
        !isStash &&
        !poolMember &&
        !newNotStaking.find((n: AccountNotStaking) => n.address === address)
      ) {
        newNotStaking.push({ address, delegates });
      }
    }
    setNominating(newNominating);
    setInPool(newInPool);
    setNotStaking(newNotStaking);
  };

  return (
    <PaddingWrapper>
      <CustomHeaderWrapper>
        <h1>{t('accounts')}</h1>
        <ButtonPrimaryInvert
          text={t('goToConnect')}
          iconLeft={faChevronLeft}
          iconTransform="shrink-3"
          onClick={() => replaceModalWith('Connect', {}, 'large')}
          marginLeft
        />
      </CustomHeaderWrapper>
      {activeAccount ? (
        <>
          <h4
            style={{
              padding: '0.5rem 0.5rem 0 0.5rem',
              margin: 0,
              opacity: 0.9,
            }}
          >
            {t('activeAccount')}
          </h4>
          <AccountButton
            address={activeAccount}
            meta={getAccount(activeAccount)}
            label={['danger', t('disconnect')]}
            disconnect
          />
        </>
      ) : (
        <AccountWrapper>
          <div>
            <div>
              <h4>{t('noActiveAccount')}</h4>
            </div>
            <div />
          </div>
        </AccountWrapper>
      )}
      {nominating.length ? (
        <>
          <AccountSeparator />
          <Action text={t('nominating')} />
          {nominating.map(
            ({ address, delegates }: AccountNominating, i: number) => {
              return (
                <React.Fragment key={`acc_nominating_${i}`}>
                  <AccountButton address={address} meta={getAccount(address)} />
                  {address && (
                    <Delegates delegator={address} delegates={delegates} />
                  )}
                </React.Fragment>
              );
            }
          )}
        </>
      ) : null}

      {inPool.length ? (
        <>
          <AccountSeparator />
          <Action text={t('inPool')} />
          {inPool.map(({ address, delegates }: AccountInPool, i: number) => {
            return (
              <React.Fragment key={`acc_in_pool_${i}`}>
                <AccountButton address={address} meta={getAccount(address)} />
                {address && (
                  <Delegates delegator={address} delegates={delegates} />
                )}
              </React.Fragment>
            );
          })}
        </>
      ) : null}

      {notStaking.length ? (
        <>
          <AccountSeparator />
          <Action text={t('notStaking')} />
          {notStaking.map(
            ({ address, delegates }: AccountNotStaking, i: number) => {
              return (
                <React.Fragment key={`acc_not_staking_${i}`}>
                  <AccountButton address={address} meta={getAccount(address)} />
                  {address && (
                    <Delegates delegator={address} delegates={delegates} />
                  )}
                </React.Fragment>
              );
            }
          )}
        </>
      ) : null}
    </PaddingWrapper>
  );
};
