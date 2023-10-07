// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faChevronLeft, faLinkSlash } from '@fortawesome/free-solid-svg-icons';
import {
  ActionItem,
  ButtonPrimaryInvert,
  ButtonText,
  ModalCustomHeader,
  ModalPadding,
} from '@polkadot-cloud/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBalances } from 'contexts/Balances';
import { useBonded } from 'contexts/Bonded';
import {
  useExtensions,
  useEffectIgnoreInitial,
  useOverlay,
} from '@polkadot-cloud/react/hooks';
import { usePoolMemberships } from 'contexts/Pools/PoolMemberships';
import { useProxies } from 'contexts/Proxies';
import { useActiveAccount } from 'contexts/Connect/ActiveAccount';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';
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
  const { balances } = useBalances();
  const { getDelegates } = useProxies();
  const { extensions } = useExtensions();
  const { bondedAccounts } = useBonded();
  const { ledgers, getLocks } = useBalances();
  const { memberships } = usePoolMemberships();
  const {
    replaceModal,
    status: modalStatus,
    setModalResize,
  } = useOverlay().modal;
  const { accounts } = useImportedAccounts();
  const { activeAccount, setActiveAccount, setActiveProxy } =
    useActiveAccount();

  // Store local copy of accounts.
  const [localAccounts, setLocalAccounts] = useState(accounts);

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
  const nominating: AccountNominating[] = [];
  const inPool: AccountInPool[] = [];
  const nominatingAndPool: AccountNominatingAndInPool[] = [];
  const notStaking: AccountNotStaking[] = [];

  for (const { address } of localAccounts) {
    let isNominating = false;
    let isInPool = false;
    const isStash = stashes[stashes.indexOf(address)] ?? null;
    const delegates = getDelegates(address);

    const poolMember = memberships.find((m) => m.address === address) ?? null;

    // If stash exists, add address to nominating list.
    if (
      isStash &&
      nominating.find((a) => a.address === address) === undefined
    ) {
      isNominating = true;
    }

    // if pooling, add address to active pooling.
    if (poolMember) {
      if (!inPool.find((n) => n.address === address)) {
        isInPool = true;
      }
    }

    // If not doing anything, add address to `notStaking`.
    if (
      !isStash &&
      !poolMember &&
      !notStaking.find((n) => n.address === address)
    ) {
      notStaking.push({ address, delegates });
    }

    if (isNominating && isInPool && poolMember) {
      nominatingAndPool.push({
        ...poolMember,
        address,
        stashImported: true,
        delegates,
      });
    }

    if (isNominating && !isInPool) {
      nominating.push({ address, stashImported: true, delegates });
    }
    if (!isNominating && isInPool && poolMember) {
      inPool.push({ ...poolMember, delegates });
    }
  }

  useEffect(() => setLocalAccounts(accounts), [accounts]);

  useEffectIgnoreInitial(() => {
    if (modalStatus === 'open') setModalResize();
  }, [activeAccount, accounts, bondedAccounts, balances, ledgers, extensions]);

  return (
    <ModalPadding>
      <ModalCustomHeader>
        <div className="first">
          <h1>{t('accounts')}</h1>
          <ButtonPrimaryInvert
            text={t('goToConnect')}
            iconLeft={faChevronLeft}
            iconTransform="shrink-3"
            onClick={() =>
              replaceModal({ key: 'Connect', options: { disableScroll: true } })
            }
            marginLeft
          />
        </div>
        <div>
          {activeAccount && (
            <ButtonText
              style={{
                color: 'var(--accent-color-primary)',
              }}
              text={t('disconnect')}
              iconRight={faLinkSlash}
              onClick={() => {
                setActiveAccount(null);
                setActiveProxy(null);
              }}
            />
          )}
        </div>
      </ModalCustomHeader>
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
            <React.Fragment key={`acc_nominating_and_pool_${i}`}>
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
    </ModalPadding>
  );
};
