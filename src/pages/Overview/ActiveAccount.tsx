// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useConnect } from 'contexts/Connect';
import { Identicon } from 'library/Identicon';
import { clipAddress } from 'Utils';
import { useNotifications } from 'contexts/Notifications';
import { NotificationText } from 'contexts/Notifications/types';
import { ActiveAccounWrapper } from './Wrappers';

export const ActiveAccount = () => {
  const { addNotification } = useNotifications();
  const { activeAccount, getAccount } = useConnect();
  const accountData = getAccount(activeAccount);

  // click to copy notification
  let notification: NotificationText | null = null;
  if (accountData !== null) {
    notification = {
      title: 'Address Copied to Clipboard',
      subtitle: accountData.address,
    };
  }

  return (
    <>
      <ActiveAccounWrapper>
        <div className="account">
          <div className="title">
            <h3>
              {accountData && (
                <>
                  <div className="icon">
                    <Identicon value={accountData.address} size="1.6rem" />
                  </div>
                  {clipAddress(accountData.address)} <div className="sep" />
                  {accountData.name}
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
                </>
              )}

              {!accountData && 'No Account Connected'}
            </h3>
          </div>
        </div>
      </ActiveAccounWrapper>
    </>
  );
};

export default ActiveAccount;
