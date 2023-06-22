// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faGlasses } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { clipAddress, planckToUnit } from '@polkadotcloud/utils';
import { useApi } from 'contexts/Api';
import { useBalances } from 'contexts/Balances';
import { useConnect } from 'contexts/Connect';
import { useExtensions } from 'contexts/Extensions';
import { useModal } from 'contexts/Modal';
import { useTransferOptions } from 'contexts/TransferOptions';
import { ReactComponent as LedgerIconSVG } from 'img/ledgerIcon.svg';
import { ReactComponent as PolkadotVaultIconSVG } from 'img/polkadotVault.svg';
import { Identicon } from 'library/Identicon';
import { useTranslation } from 'react-i18next';
import { AccountWrapper } from './Wrappers';
import type { AccountItemProps } from './types';

export const AccountButton = ({
  address,
  label,
  delegator,
  noBorder = false,
  proxyType,
}: AccountItemProps) => {
  const { t } = useTranslation('modals');
  const { setStatus } = useModal();
  const { extensions } = useExtensions();
  const {
    activeAccount,
    connectToAccount,
    getAccount,
    activeProxy,
    activeProxyType,
    setActiveProxy,
  } = useConnect();
  const {
    network: { units, unit },
  } = useApi();
  const { getBalance } = useBalances();
  const balance = getBalance(address);
  const { getTransferOptions } = useTransferOptions();
  const allTransferOptions = getTransferOptions(address);
  const poolBondOpions = allTransferOptions.pool;
  const unlockingPools = poolBondOpions.totalUnlocking.plus(
    poolBondOpions.totalUnlocked
  );

  // user's total balance
  const { free } = balance;
  const totalBalance = planckToUnit(
    free.plus(poolBondOpions.active).plus(unlockingPools),
    units
  );

  const meta = getAccount(address || '');

  const Icon =
    meta?.source === 'ledger'
      ? LedgerIconSVG
      : meta?.source === 'vault'
      ? PolkadotVaultIconSVG
      : extensions.find(({ id }) => id === meta?.source)?.icon ?? undefined;

  const imported = !!meta;
  const connectTo = delegator || address || '';
  const connectProxy = delegator ? address || null : '';

  const isActive =
    (connectTo === activeAccount &&
      address === activeAccount &&
      !activeProxy) ||
    (connectProxy === activeProxy &&
      proxyType === activeProxyType &&
      activeProxy);

  return (
    <AccountWrapper className={isActive ? 'active' : undefined}>
      <button
        type="button"
        disabled={!imported}
        onClick={() => {
          if (imported) {
            connectToAccount(getAccount(connectTo));
            setActiveProxy(
              proxyType ? { address: connectProxy, proxyType } : null
            );
            setStatus(2);
          }
        }}
        style={noBorder ? { border: 'none' } : undefined}
      >
        <div>
          {delegator && (
            <div className="delegator">
              <Identicon value={delegator} size={26} />
            </div>
          )}
          <div className="identicon">
            <Identicon value={address ?? ''} size={26} />
          </div>
          <span className="name">
            {delegator && (
              <>
                <span>
                  {proxyType} {t('proxy')}
                </span>
              </>
            )}
            {meta?.name ?? clipAddress(address ?? '')}
          </span>
        </div>
        {meta?.source === 'external' && (
          <div
            className="label warning"
            style={{ color: '#a17703', paddingLeft: '0.5rem' }}
          >
            {t('readOnly')}
          </div>
        )}
        <div style={{ color: '#a17703' }}>
          {totalBalance.toFixed(2)}&nbsp;
          {unit}
        </div>
        <div className={label === undefined ? `` : label[0]}>
          {label !== undefined ? <h5>{label[1]}</h5> : null}
          {Icon !== undefined ? <Icon className="icon" /> : null}

          {meta?.source === 'external' && (
            <FontAwesomeIcon
              icon={faGlasses}
              className="icon"
              style={{ opacity: 0.7 }}
            />
          )}
        </div>
      </button>
    </AccountWrapper>
  );
};
