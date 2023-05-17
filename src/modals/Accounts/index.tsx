// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faChevronLeft, faLinkSlash } from '@fortawesome/free-solid-svg-icons';
import {
  ActionItem,
  ButtonPrimaryInvert,
  ButtonText,
} from '@polkadotcloud/core-ui';
import { useApi } from 'contexts/Api';
import { useBalances } from 'contexts/Balances';
import { useBonded } from 'contexts/Bonded';
import { useConnect } from 'contexts/Connect';
import { useExtensions } from 'contexts/Extensions';
import { useModal } from 'contexts/Modal';
import { usePoolMemberships } from 'contexts/Pools/PoolMemberships';
import { useProxies } from 'contexts/Proxies';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CustomHeaderWrapper, PaddingWrapper } from '../Wrappers';
import { AccountButton } from './Account';
import { Delegates } from './Delegates';
import { AccountSeparator, AccountWrapper } from './Wrappers';
import type {
  AccountInPool,
  AccountNominating,
  AccountNominatingAndInPool,
  AccountNotStaking,
} from './types';

export const Accounts = () => {
  const { t } = useTranslation('modals');
  const { isReady } = useApi();
  const { activeAccount, disconnectFromAccount, setActiveProxy, accounts } =
    useConnect();
  const { bondedAccounts } = useBonded();
  const { balances } = useBalances();
  const { ledgers, getLocks } = useBalances();
  const { memberships } = usePoolMemberships();
  const { replaceModalWith, setResize } = useModal();
  const { extensions } = useExtensions();
  const { getDelegates } = useProxies();

  // store local copy of accounts
  const [localAccounts, setLocalAccounts] = useState(accounts);

  // store accounts that are actively newNominating.
  const [nominating, setNominating] = useState<AccountNominating[]>([]);
  const [inPool, setInPool] = useState<AccountInPool[]>([]);
  const [notStaking, setNotStaking] = useState<AccountNotStaking[]>([]);
  const [nominatingAndPool, setNominatingAndPool] = useState<
    AccountNominatingAndInPool[]
  >([]);

  const getAccountsStatus = () => {
    const stashes: string[] = [];

    // accumulate imported stash accounts
    for (const { address } of localAccounts) {
      const locks = getLocks(address);

      // account is a stash if they have an active `staking` lock
      if (locks.find(({ id }) => id === 'staking')) {
        stashes.push(address);
      }
    }

    // construct account groupings
    const newNominating: AccountNominating[] = [];
    const newInPool: AccountInPool[] = [];
    const newNominatingAndInPool: AccountNominatingAndInPool[] = [];
    const newNotStaking: AccountNotStaking[] = [];

    for (const { address } of localAccounts) {
      let isNominating = false;
      let isInPool = false;
      const isStash = stashes[stashes.indexOf(address)] ?? null;
      const delegates = getDelegates(address);

      const poolMember = memberships.find((m) => m.address === address) ?? null;

      // If stash exists, add address to nominating list.
      if (
        isStash &&
        newNominating.find((a) => a.address === address) === undefined
      ) {
        isNominating = true;
      }

      // if pooling, add address to active pooling.
      if (poolMember) {
        if (!newInPool.find((n) => n.address === address)) {
          isInPool = true;
        }
      }

      // If not doing anything, add address to `notStaking`.
      if (
        !isStash &&
        !poolMember &&
        !newNotStaking.find((n) => n.address === address)
      ) {
        newNotStaking.push({ address, delegates });
      }

      if (isNominating && isInPool && poolMember) {
        newNominatingAndInPool.push({
          ...poolMember,
          address,
          stashImported: true,
          delegates,
        });
      }

      if (isNominating && !isInPool) {
        newNominating.push({ address, stashImported: true, delegates });
      }
      if (!isNominating && isInPool && poolMember) {
        newInPool.push({ ...poolMember, delegates });
      }
    }

    setNominatingAndPool(newNominatingAndInPool);
    setNominating(newNominating);
    setInPool(newInPool);
    setNotStaking(newNotStaking);
  };

  useEffect(() => {
    setLocalAccounts(accounts);
  }, [isReady, accounts]);

  useEffect(() => {
    getAccountsStatus();
  }, [localAccounts, bondedAccounts, balances, ledgers, accounts, memberships]);

  useEffect(() => {
    setResize();
  }, [activeAccount, accounts, bondedAccounts, balances, ledgers, extensions]);

  return (
    <PaddingWrapper>
      <CustomHeaderWrapper>
        <div className="first">
          <h1>{t('accounts')}</h1>
          <ButtonPrimaryInvert
            text={t('goToConnect')}
            iconLeft={faChevronLeft}
            iconTransform="shrink-3"
            onClick={() =>
              replaceModalWith('Connect', { disableScroll: true }, 'large')
            }
            marginLeft
          />
        </div>
        <div>
          {activeAccount && (
            <ButtonText
              style={{
                color: 'var(--network-color-primary)',
              }}
              text={t('disconnect')}
              iconRight={faLinkSlash}
              onClick={() => {
                disconnectFromAccount();
                setActiveProxy(null);
              }}
            />
          )}
        </div>
      </CustomHeaderWrapper>
      {!activeAccount && !accounts.length && (
        <AccountWrapper style={{ marginTop: '1.5rem' }}>
          <div>
            <div>
              <h4>{t('noActiveAccount')}</h4>
            </div>
            <div />
          </div>
        </AccountWrapper>
      )}

      {nominatingAndPool.length ? (
        <>
          <AccountSeparator />
          <ActionItem text={t('nominatingAndInPool')} />
          {nominatingAndPool.map(({ address, delegates }, i) => (
            <React.Fragment key={`acc_nominating_${i}`}>
              <AccountButton address={address} />
              {address && (
                <Delegates delegator={address} delegates={delegates} />
              )}
            </React.Fragment>
          ))}
        </>
      ) : null}

      {nominating.length ? (
        <>
          <AccountSeparator />
          <ActionItem text={t('nominating')} />
          {nominating.map(({ address, delegates }, i) => (
            <React.Fragment key={`acc_nominating_${i}`}>
              <AccountButton address={address} />
              {address && (
                <Delegates delegator={address} delegates={delegates} />
              )}
            </React.Fragment>
          ))}
        </>
      ) : null}

      {inPool.length ? (
        <>
          <AccountSeparator />
          <ActionItem text={t('inPool')} />
          {inPool.map(({ address, delegates }, i) => (
            <React.Fragment key={`acc_in_pool_${i}`}>
              <AccountButton address={address} />
              {address && (
                <Delegates delegator={address} delegates={delegates} />
              )}
            </React.Fragment>
          ))}
        </>
      ) : null}

      {notStaking.length ? (
        <>
          <AccountSeparator />
          <ActionItem text={t('notStaking')} />
          {notStaking.map(({ address, delegates }, i) => (
            <React.Fragment key={`acc_not_staking_${i}`}>
              <AccountButton address={address} />
              {address && (
                <Delegates delegator={address} delegates={delegates} />
              )}
            </React.Fragment>
          ))}
        </>
      ) : null}
    </PaddingWrapper>
  );
};
