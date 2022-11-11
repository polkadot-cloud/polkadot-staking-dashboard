// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useConnect } from 'contexts/Connect';
import { useNotifications } from 'contexts/Notifications';
import { NotificationText } from 'contexts/Notifications/types';
import { Identicon } from 'library/Identicon';
import { useTranslation } from 'react-i18next';
import { clipAddress, convertRemToPixels } from 'Utils';
import { ActiveAccounWrapper } from './Wrappers';

export const ActiveAccount = () => {
  const { addNotification } = useNotifications();
  const { activeAccount, getAccount } = useConnect();
  const accountData = getAccount(activeAccount);
  const { t } = useTranslation('common');

  // click to copy notification
  let notification: NotificationText | null = null;
  if (accountData !== null) {
    notification = {
      title: t('pages.overview.address_copied'),
      subtitle: accountData.address,
    };
  }

  return (
    <ActiveAccounWrapper>
      <div className="account">
        <div className="title">
          <h3>
            {accountData && (
              <>
                <div className="icon">
                  <Identicon
                    value={accountData.address}
                    size={convertRemToPixels('1.7rem')}
                  />
                </div>
                {clipAddress(accountData.address)}
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(accountData.address);
                    if (notification) {
                      addNotification(notification);
                    }
                  }}
                >
                  <FontAwesomeIcon
                    className="copy"
                    icon={faCopy as IconProp}
                    transform="shrink-1"
                  />
                </button>
                {accountData.name !== clipAddress(accountData.address) && (
                  <>
                    <div className="sep" />
                    <div className="rest">
                      <span className="name">{accountData.name}</span>
                    </div>
                  </>
                )}
              </>
            )}

            {!accountData && t('pages.overview.no_account_connected')}
          </h3>
        </div>
      </div>
    </ActiveAccounWrapper>
  );
};

export default ActiveAccount;
