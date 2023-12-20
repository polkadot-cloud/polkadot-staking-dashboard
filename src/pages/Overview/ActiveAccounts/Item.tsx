// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ellipsisFn, remToUnit } from '@polkadot-cloud/utils';
import { useTranslation } from 'react-i18next';
import type { NotificationText } from 'static/NotificationsController/types';
import { useProxies } from 'contexts/Proxies';
import { Polkicon } from '@polkadot-cloud/react';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';
import { ItemWrapper } from './Wrappers';
import type { ActiveAccountProps } from './types';
import { NotificationsController } from 'static/NotificationsController';

export const Item = ({ address, delegate = null }: ActiveAccountProps) => {
  const { t } = useTranslation('pages');
  const { getProxyDelegate } = useProxies();
  const { getAccount } = useImportedAccounts();

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
                  <Polkicon
                    address={delegatorAddress || ''}
                    size={remToUnit('1.7rem')}
                  />
                </div>
              )}
              <div className="icon">
                <Polkicon address={primaryAddress} size={remToUnit('1.7rem')} />
              </div>
              {delegatorAddress && (
                <span>
                  {proxyDelegate?.proxyType} {t('overview.proxy')}
                  <FontAwesomeIcon icon={faArrowLeft} transform="shrink-2" />
                </span>
              )}
              {ellipsisFn(primaryAddress)}
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(primaryAddress);
                  if (notification) {
                    NotificationsController.emit(notification);
                  }
                }}
              >
                <FontAwesomeIcon
                  className="copy"
                  icon={faCopy}
                  transform="shrink-4"
                />
              </button>
              {accountData.name !== ellipsisFn(primaryAddress) && (
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
