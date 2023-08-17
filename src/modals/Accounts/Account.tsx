// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faGlasses } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { clipAddress, planckToUnit } from '@polkadot-cloud/utils';
import { useTranslation } from 'react-i18next';
import { Extensions } from '@polkadot-cloud/community/extensions';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { ReactComponent as LedgerIconSVG } from 'img/ledgerIcon.svg';
import { ReactComponent as PolkadotVaultIconSVG } from 'img/polkadotVault.svg';
import { Identicon } from 'library/Identicon';
import { useApi } from 'contexts/Api';
import { useTransferOptions } from 'contexts/TransferOptions';
import { AccountWrapper } from './Wrappers';
import type { AccountItemProps } from './types';

export const AccountButton = ({
  label,
  address,
  delegator,
  proxyType,
  noBorder = false,
}: AccountItemProps) => {
  const { t } = useTranslation('modals');
  const {
    getAccount,
    activeProxy,
    activeAccount,
    setActiveProxy,
    activeProxyType,
    connectToAccount,
  } = useConnect();
  const { setStatus } = useModal();
  const { units, unit } = useApi().network;
  const { getTransferOptions } = useTransferOptions();
  const { freeBalance } = getTransferOptions(address || '');

  // Accumulate account data.
  const meta = getAccount(address || '');

  const imported = !!meta;
  const connectTo = delegator || address || '';
  const connectProxy = delegator ? address || null : '';

  // Determine account source icon.
  const Icon =
    meta?.source === 'ledger'
      ? LedgerIconSVG
      : meta?.source === 'vault'
      ? PolkadotVaultIconSVG
      : Extensions[meta?.source || '']?.Icon ?? undefined;

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
    if (!imported) return;
    connectToAccount(getAccount(connectTo));
    setActiveProxy(proxyType ? { address: connectProxy, proxyType } : null);
    setStatus('closing');
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
                <Identicon value={delegator} size={23} />
              </div>
            )}
            <div className="identicon">
              <Identicon value={address ?? ''} size={23} />
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
            {`Free: ${planckToUnit(freeBalance, units)
              .decimalPlaces(3)
              .toFormat()} ${unit}`}
          </span>
        </section>
      </div>
    </AccountWrapper>
  );
};
