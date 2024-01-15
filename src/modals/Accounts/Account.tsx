// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faGlasses } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ellipsisFn, planckToUnit } from '@polkadot-cloud/utils';
import { useTranslation } from 'react-i18next';
import { ExtensionIcons } from '@polkadot-cloud/assets/extensions';
import LedgerSVG from '@polkadot-cloud/assets/extensions/svg/ledgersquare.svg?react';
import PolkadotVaultSVG from '@polkadot-cloud/assets/extensions/svg/polkadotvault.svg?react';
import { Polkicon } from '@polkadot-cloud/react';
import { useOverlay } from '@polkadot-cloud/react/hooks';
import { useNetwork } from 'contexts/Network';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';
import { AccountWrapper } from './Wrappers';
import type { AccountItemProps } from './types';
import BigNumber from 'bignumber.js';

export const AccountButton = ({
  label,
  address,
  delegator,
  proxyType,
  noBorder = false,
  transferrableBalance,
}: AccountItemProps) => {
  const { t } = useTranslation('modals');
  const { getAccount } = useImportedAccounts();
  const {
    activeProxy,
    activeAccount,
    setActiveAccount,
    setActiveProxy,
    activeProxyType,
  } = useActiveAccounts();
  const { setModalStatus } = useOverlay().modal;
  const { units, unit } = useNetwork().networkData;

  // Accumulate account data.
  const meta = getAccount(address || '');

  const imported = !!meta;
  const connectTo = delegator || address || '';
  const connectProxy = delegator ? address || null : '';

  // Determine account source icon.
  const Icon =
    meta?.source === 'ledger'
      ? LedgerSVG
      : meta?.source === 'vault'
        ? PolkadotVaultSVG
        : ExtensionIcons[meta?.source || ''] || undefined;

  // Determine if this account is active (active account or proxy).
  const isActive =
    (connectTo === activeAccount &&
      address === activeAccount &&
      !activeProxy) ||
    (connectProxy === activeProxy &&
      proxyType === activeProxyType &&
      activeProxy);

  // Handle account click. Handles both active account and active proxy.
  const handleClick = () => {
    if (!imported) {
      return;
    }
    setActiveAccount(getAccount(connectTo)?.address || null);
    setActiveProxy(proxyType ? { address: connectProxy, proxyType } : null);
    setModalStatus('closing');
  };

  return (
    <AccountWrapper className={isActive ? 'active' : undefined}>
      <div className={noBorder ? 'noBorder' : undefined}>
        <section className="head">
          <button
            type="button"
            onClick={() => handleClick()}
            disabled={!imported}
          >
            {delegator && (
              <div className="delegator">
                <Polkicon address={delegator} size={23} />
              </div>
            )}
            <div className="identicon">
              <Polkicon address={address ?? ''} size={23} />
            </div>
            <span className="name">
              {delegator && (
                <span>
                  {proxyType} {t('proxy')}
                </span>
              )}
              {meta?.name ?? ellipsisFn(address ?? '')}
            </span>
            {meta?.source === 'external' && (
              <div
                className="label warning"
                style={{ color: '#a17703', paddingLeft: '0.5rem' }}
              >
                {t('readOnly')}
              </div>
            )}
            <div className={label === undefined ? `` : label[0]}>
              {label !== undefined ? <h5>{label[1]}</h5> : null}
              {Icon !== undefined ? (
                <span className="icon">
                  <Icon />
                </span>
              ) : null}

              {meta?.source === 'external' && (
                <FontAwesomeIcon
                  icon={faGlasses}
                  className="icon"
                  style={{ opacity: 0.7 }}
                />
              )}
            </div>
          </button>
        </section>
        <section className="foot">
          <span className="balance">
            {`${t('free')}: ${planckToUnit(
              transferrableBalance || new BigNumber(0),
              units
            )
              .decimalPlaces(3)
              .toFormat()} ${unit}`}
          </span>
        </section>
      </div>
    </AccountWrapper>
  );
};
