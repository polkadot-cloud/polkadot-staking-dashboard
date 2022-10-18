// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNotifications } from 'contexts/Notifications';
import { NotificationText } from 'contexts/Notifications/types';
import { useTranslation } from 'react-i18next';
import { CopyAddressProps } from '../types';

export const CopyAddress = (props: CopyAddressProps) => {
  const { addNotification } = useNotifications();
  const { validator } = props;
  const { address } = validator;
  const { t } = useTranslation('common');

  // copy address notification
  const notificationCopyAddress: NotificationText | null =
    address == null
      ? null
      : {
          title: t('library.address_copied_to_clipboard'),
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
        <FontAwesomeIcon icon={faCopy as IconProp} />
      </button>
    </div>
  );
};

export default CopyAddress;
