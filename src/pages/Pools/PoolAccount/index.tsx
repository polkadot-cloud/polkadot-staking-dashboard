// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ellipsisFn, remToUnit } from '@w3ux/utils';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { NotificationText } from 'static/NotificationsController/types';
import { Polkicon } from '@w3ux/react-polkicon';
import { getIdentityDisplay } from 'library/ValidatorList/ValidatorItem/Utils';
import type { PoolAccountProps } from '../types';
import { Wrapper } from './Wrapper';
import { NotificationsController } from 'static/NotificationsController';

export const PoolAccount = ({ address, pool }: PoolAccountProps) => {
  const { t } = useTranslation('pages');

  const roleIdentities = pool?.bondedPool?.roleIdentities;
  const identities = roleIdentities?.identities || {};
  const supers = roleIdentities?.supers || {};
  const synced = roleIdentities !== undefined;

  const display = address
    ? getIdentityDisplay(identities[address], supers[address])
    : null;

  let notification: NotificationText | null = null;
  if (address !== null) {
    notification = {
      title: t('pools.addressCopied'),
      subtitle: address,
    };
  }

  return (
    <Wrapper>
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
              <Polkicon address={address} size={remToUnit('1.6rem')} />
            </div>
            <h4>{display}</h4>
          </>
        ) : (
          <>
            <div className="icon">
              <Polkicon address={address} size={remToUnit('1.6rem')} />
            </div>
            <h4>{ellipsisFn(address)}</h4>
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
                    NotificationsController.emit(notification);
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
