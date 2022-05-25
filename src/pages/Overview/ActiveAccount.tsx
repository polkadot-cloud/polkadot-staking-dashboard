// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { motion } from 'framer-motion';
import { useConnect } from '../../contexts/Connect';
import { Separator, AccountWrapper } from './Wrappers';
import { Identicon } from '../../library/Identicon';
import { clipAddress } from '../../Utils';
import { useNotifications } from '../../contexts/Notifications';

export const ActiveAccount = () => {
  const { addNotification } = useNotifications();
  const { activeAccount, getAccount }: any = useConnect();
  const accountData = getAccount(activeAccount);

  // click to copy notification
  let notification = {};
  if (accountData !== null) {
    notification = {
      title: 'Address Copied to Clipboard',
      subtitle: accountData.address,
    };
  }

  return (
    <AccountWrapper>
      <div className="account">
        {accountData !== null && (
          <>
            <div className="icon">
              <Identicon value={accountData.address} size="1.6rem" />
            </div>
            <div className="title">
              <h4>
                {clipAddress(accountData.address)}
                <div className="sep" />{' '}
                <span className="addr">{accountData.name}</span>
              </h4>
            </div>
            <div>
              <motion.div
                className="copy"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <button
                  type="button"
                  onClick={() => addNotification(notification)}
                >
                  <CopyToClipboard text={accountData.address}>
                    <FontAwesomeIcon
                      icon={faCopy as IconProp}
                      transform="grow-3"
                    />
                  </CopyToClipboard>
                </button>
              </motion.div>
            </div>
          </>
        )}
        {accountData === null && (
          <>
            <h4 style={{ marginLeft: 0 }}>Account Not Connected</h4>
            <div />
          </>
        )}
      </div>
      <Separator />
    </AccountWrapper>
  );
};

export default ActiveAccount;
