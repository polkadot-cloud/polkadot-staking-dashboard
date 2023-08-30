// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { clipAddress, remToUnit } from '@polkadot-cloud/utils';
import { useTranslation } from 'react-i18next';
import { useConnect } from 'contexts/Connect';
import { useNotifications } from 'contexts/Notifications';
import type { NotificationText } from 'contexts/Notifications/types';
import { useProxies } from 'contexts/Proxies';
import { PolkadotIcon } from '@polkadot-cloud/react';
import { useTheme } from 'contexts/Themes';
import { ItemWrapper } from './Wrappers';
import type { ActiveAccountProps } from './types';

export const Item = ({ address, delegate = null }: ActiveAccountProps) => {
  const { t } = useTranslation('pages');
  const { addNotification } = useNotifications();
  const { getAccount } = useConnect();
  const { getProxyDelegate } = useProxies();
  const { mode } = useTheme();

  const primaryAddress = delegate || address || '';
  const delegatorAddress = delegate ? address : null;

  const accountData = getAccount(primaryAddress);

  // click to copy notification
  let notification: NotificationText | null = null;
  if (accountData !== null) {
    notification = {
      title: t('overview.addressCopied'),
      subtitle: accountData.address,
    };
  }

  const proxyDelegate = getProxyDelegate(delegatorAddress, primaryAddress);

  return (
    <ItemWrapper>
      <div className="title">
        <h4>
          {accountData && (
            <>
              {delegatorAddress && (
                <div className="delegator">
                  <PolkadotIcon
                    dark={mode === 'dark'}
                    nocopy
                    address={delegatorAddress || ''}
                    size={remToUnit('1.7rem')}
                  />
                </div>
              )}
              <div className="icon">
                <PolkadotIcon
                  dark={mode === 'dark'}
                  nocopy
                  address={primaryAddress}
                  size={remToUnit('1.7rem')}
                />
              </div>
              {delegatorAddress && (
                <>
                  <span>
                    {proxyDelegate?.proxyType} {t('overview.proxy')}
                    <FontAwesomeIcon icon={faArrowLeft} transform="shrink-2" />
                  </span>
                </>
              )}
              {clipAddress(primaryAddress)}
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(primaryAddress);
                  if (notification) {
                    addNotification(notification);
                  }
                }}
              >
                <FontAwesomeIcon
                  className="copy"
                  icon={faCopy}
                  transform="shrink-4"
                />
              </button>
              {accountData.name !== clipAddress(primaryAddress) && (
                <>
                  <div className="sep" />
                  <div className="rest">
                    <span className="name">{accountData.name}</span>
                  </div>
                </>
              )}
            </>
          )}

          {!accountData ? t('overview.noActiveAccount') : null}
        </h4>
      </div>
    </ItemWrapper>
  );
};
