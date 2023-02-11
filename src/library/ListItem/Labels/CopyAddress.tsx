// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNotifications } from 'contexts/Notifications';
import { NotificationText } from 'contexts/Notifications/types';
import { useTranslation } from 'react-i18next';
import { CopyAddressProps } from '../types';

export const CopyAddress = ({ address }: CopyAddressProps) => {
  const { t } = useTranslation('library');
  const { addNotification } = useNotifications();

  // copy address notification
  const notificationCopyAddress: NotificationText | null =
    address == null
      ? null
      : {
          title: t('addressCopiedToClipboard'),
          subtitle: address,
        };

  return (
    <div className="label">
      <button
        type="button"
        onClick={() => {
          if (notificationCopyAddress) {
            addNotification(notificationCopyAddress);
          }
          navigator.clipboard.writeText(address || '');
        }}
      >
        <FontAwesomeIcon icon={faCopy} transform="shrink-1" />
      </button>
    </div>
  );
};
