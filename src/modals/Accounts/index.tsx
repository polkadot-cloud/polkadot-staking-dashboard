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
import { Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBonded } from 'contexts/Bonded';
import {
  useExtensions,
  useEffectIgnoreInitial,
  useOverlay,
} from '@polkadot-cloud/react/hooks';
import { usePoolMemberships } from 'contexts/Pools/PoolMemberships';
import { useProxies } from 'contexts/Proxies';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
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
import type { ImportedAccount } from '@polkadot-cloud/react/types';
import { useActiveBalances } from 'library/Hooks/useActiveBalances';
import type { MaybeAddress } from 'types';
import { useTransferOptions } from 'contexts/TransferOptions';
import BigNumber from 'bignumber.js';
import { useApi } from 'contexts/Api';

export const Accounts = () => {
  const { t } = useTranslation('modals');
  const {
    consts: { existentialDeposit },
  } = useApi();
  const { getDelegates } = useProxies();
  const { bondedAccounts } = useBonded();
  const { extensionsStatus } = useExtensions();
  const { memberships } = usePoolMemberships();
  const {
    replaceModal,
    status: modalStatus,
    setModalResize,
  } = useOverlay().modal;
  const { accounts } = useImportedAccounts();
  const { getFeeReserve } = useTransferOptions();
  const { activeAccount, setActiveAccount, setActiveProxy } =
    useActiveAccounts();

  // Store local copy of accounts.
  const [localAccounts, setLocalAccounts] =
    useState<ImportedAccount[]>(accounts);

  // Listen to balance updates for entire accounts list.
  const { getLocks, getBalance, getEdReserved } = useActiveBalances({
    accounts: localAccounts.map(({ address }) => address),
  });

  // Calculate transferrable balance of an address.
  const getTransferrableBalance = (address: MaybeAddress) => {
    // Get fee reserve from local storage.
    const feeReserve = getFeeReserve(address);
    // Get amount required for existential deposit.
    const edReserved = getEdReserved(address, existentialDeposit);
    // Gets actual balance numbers.
    const { free, frozen } = getBalance(address);
    // Minus reserves and frozen balance from free to get transferrable.
    return BigNumber.max(
      free.minus(edReserved).minus(feeReserve).minus(frozen),
      0
    );
  };

  const stashes: string[] = [];
  // accumulate imported stash accounts
  for (const { address } of localAccounts) {
    const { locks } = getLocks(address);

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

    // Inject transferrable balance into delegates list.
    if (delegates?.delegates) {
      delegates.delegates = delegates?.delegates.map((d) => ({
        ...d,
        transferrableBalance: getTransferrableBalance(d.delegate),
      }));
    }

    const poolMember = memberships.find((m) => m.address === address) ?? null;

    // Check if nominating.
    if (
      isStash &&
      nominating.find((a) => a.address === address) === undefined
    ) {
      isNominating = true;
    }

    // Check if in pool.
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
      continue;
    }

    // If both nominating and in pool, add to this list.
    if (
      isNominating &&
      isInPool &&
      poolMember &&
      !nominatingAndPool.find((n) => n.address === address)
    ) {
      nominatingAndPool.push({
        ...poolMember,
        address,
        stashImported: true,
        delegates,
      });
      continue;
    }

    // Nominating only.
    if (isNominating && !isInPool) {
      nominating.push({ address, stashImported: true, delegates });
      continue;
    }

    // In pool only.
    if (!isNominating && isInPool && poolMember) {
      inPool.push({ ...poolMember, delegates });
    }
  }

  // Refresh local accounts state when context accounts change.
  useEffect(() => setLocalAccounts(accounts), [accounts]);

  // Resize if modal open upon state changes.
  useEffectIgnoreInitial(() => {
    if (modalStatus === 'open') {
      setModalResize();
    }
  }, [activeAccount, accounts, bondedAccounts, extensionsStatus]);

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
              <h4 style={{ padding: '0.75rem 1rem' }}>
                {t('noActiveAccount')}
              </h4>
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
            <Fragment key={`acc_nominating_and_pool_${i}`}>
              <AccountButton
                transferrableBalance={getTransferrableBalance(address)}
                address={address}
              />
              {address && (
                <Delegates delegator={address} delegates={delegates} />
              )}
            </Fragment>
          ))}
        </>
      ) : null}

      {nominating.length ? (
        <>
          <AccountSeparator />
          <ActionItem text={t('nominating')} />
          {nominating.map(({ address, delegates }, i) => (
            <Fragment key={`acc_nominating_${i}`}>
              <AccountButton
                transferrableBalance={getTransferrableBalance(address)}
                address={address}
              />
              {address && (
                <Delegates delegator={address} delegates={delegates} />
              )}
            </Fragment>
          ))}
        </>
      ) : null}

      {inPool.length ? (
        <>
          <AccountSeparator />
          <ActionItem text={t('inPool')} />
          {inPool.map(({ address, delegates }, i) => (
            <Fragment key={`acc_in_pool_${i}`}>
              <AccountButton
                transferrableBalance={getTransferrableBalance(address)}
                address={address}
              />
              {address && (
                <Delegates delegator={address} delegates={delegates} />
              )}
            </Fragment>
          ))}
        </>
      ) : null}

      {notStaking.length ? (
        <>
          <AccountSeparator />
          <ActionItem text={t('notStaking')} />
          {notStaking.map(({ address, delegates }, i) => (
            <Fragment key={`acc_not_staking_${i}`}>
              <AccountButton
                transferrableBalance={getTransferrableBalance(address)}
                address={address}
              />
              {address && (
                <Delegates delegator={address} delegates={delegates} />
              )}
            </Fragment>
          ))}
        </>
      ) : null}
    </ModalPadding>
  );
};
