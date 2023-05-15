// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faArrowLeft, faGlasses } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { clipAddress } from '@polkadotcloud/utils';
import { useConnect } from 'contexts/Connect';
import { useExtensions } from 'contexts/Extensions';
import { useModal } from 'contexts/Modal';
import { useProxies } from 'contexts/Proxies';
import { ReactComponent as LedgerIconSVG } from 'img/ledgerIcon.svg';
import { Identicon } from 'library/Identicon';
import { useTranslation } from 'react-i18next';
import { AccountWrapper } from './Wrappers';
import type { AccountItemProps } from './types';

export const AccountButton = ({
  address,
  label,
  delegator,
  noBorder = false,
}: AccountItemProps) => {
  const { t } = useTranslation('modals');
  const { setStatus } = useModal();
  const { extensions } = useExtensions();
  const {
    activeAccount,
    connectToAccount,
    getAccount,
    activeProxy,
    setActiveProxy,
  } = useConnect();
  const { getProxyDelegate } = useProxies();

  const meta = getAccount(address || '');
  const Icon =
    meta?.source === 'ledger'
      ? LedgerIconSVG
      : extensions.find((e) => e.id === meta?.source)?.icon ?? undefined;

  const imported = meta !== undefined;

  const connectTo = delegator || address || '';
  const connectProxy = delegator ? address || null : '';

  const proxyDelegate = getProxyDelegate(connectTo, connectProxy);

  const isActive =
    (connectTo === activeAccount &&
      address === activeAccount &&
      !activeProxy) ||
    (connectProxy === activeProxy && activeProxy);

  return (
    <AccountWrapper className={isActive ? 'active' : undefined}>
      <button
        type="button"
        disabled={!imported}
        onClick={() => {
          if (imported && meta) {
            connectToAccount(getAccount(connectTo));
            setActiveProxy(connectProxy);
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
                  {proxyDelegate?.proxyType} {t('proxy')}
                  <FontAwesomeIcon icon={faArrowLeft} transform="shrink-2" />
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
