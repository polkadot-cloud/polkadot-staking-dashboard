// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useIdentities } from 'contexts/Identities';
import { useNotifications } from 'contexts/Notifications';
import { NotificationText } from 'contexts/Notifications/types';
import { motion } from 'framer-motion';
import { Identicon } from 'library/Identicon';
import { getIdentityDisplay } from 'library/ValidatorList/Validator/Utils';
import { useTranslation } from 'react-i18next';
import { clipAddress, remToUnit } from 'Utils';
import { PoolAccountProps } from '../types';
import { Wrapper } from './Wrapper';

export const PoolAccount = ({
  address,
  last,
  batchKey,
  batchIndex,
}: PoolAccountProps) => {
  const { t } = useTranslation('pages');
  const { addNotification } = useNotifications();
  const { meta } = useIdentities();

  const identities = meta[batchKey]?.identities ?? [];
  const supers = meta[batchKey]?.supers ?? [];

  const identitiesSynced = identities.length > 0 ?? false;
  const supersSynced = supers.length > 0 ?? false;
  const synced = identitiesSynced && supersSynced;

  const display = getIdentityDisplay(
    identities[batchIndex],
    supers[batchIndex]
  );

  let notification: NotificationText | null = null;
  if (address !== null) {
    notification = {
      title: t('pools.addressCopied'),
      subtitle: address,
    };
  }

  return (
    <Wrapper last={last}>
      <motion.div
        className="account"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {address === null ? (
          <h4>{t('pools.notSet')}</h4>
        ) : synced && display !== null ? (
          <>
            <div className="icon">
              <Identicon value={address} size={remToUnit('1.6rem')} />
            </div>
            <h4>{display}</h4>
          </>
        ) : (
          <>
            <div className="icon">
              <Identicon value={address} size={remToUnit('1.6rem')} />
            </div>
            <h4>{clipAddress(address)}</h4>
          </>
        )}
        <div>
          <motion.div
            className="copy"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            {address !== null && (
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(address);
                  if (notification) {
                    addNotification(notification);
                  }
                }}
              >
                <FontAwesomeIcon icon={faCopy} transform="shrink-2" />
              </button>
            )}
          </motion.div>
        </div>
      </motion.div>
    </Wrapper>
  );
};
