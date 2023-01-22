// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonPrimary } from '@rossbulat/polkadot-dashboard-ui';
import { useAccount } from 'contexts/Account';
import { useNotifications } from 'contexts/Notifications';
import { NotificationText } from 'contexts/Notifications/types';
import { Identicon } from 'library/Identicon';
import { useTranslation } from 'react-i18next';
import { clipAddress, remToUnit } from 'Utils';
import { ActiveAccounWrapper } from './Wrappers';

export const ActiveAccount = () => {
  const { addNotification } = useNotifications();
  const { address, role } = useAccount();
  const { t } = useTranslation('pages');

  // click to copy notification
  let notification: NotificationText | null = null;
  if (address !== undefined) {
    notification = {
      title: t('dashboard.addressCopied'),
      subtitle: address,
    };
  }

  return (
    <ActiveAccounWrapper>
      <div className="account">
        <div className="title">
          <h3>
            {address && (
              <>
                <div className="icon">
                  <Identicon value={address} size={remToUnit('1.7rem')} />
                </div>
                {clipAddress(address)}
                <button
                  type="button"
                  className="copy-address"
                  onClick={() => {
                    navigator.clipboard.writeText(address);
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
                <div className="sep" />
                <div className="rest">
                  <span className="name">{!role ? 'No Role' : role}</span>
                  {!role && (
                    <>
                      &nbsp;&nbsp;&nbsp;
                      <ButtonPrimary text="Select a role" />
                    </>
                  )}
                </div>
              </>
            )}

            {!address && t('dashboard.noAccountConnected')}
          </h3>
        </div>
      </div>
    </ActiveAccounWrapper>
  );
};

export default ActiveAccount;
