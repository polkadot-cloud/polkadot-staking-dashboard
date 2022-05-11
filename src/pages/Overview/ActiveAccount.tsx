// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { clipAddress } from '../../Utils';
import { Identicon } from '../../library/Identicon';
import { Separator, AccountWrapper } from './Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useConnect } from '../../contexts/Connect';
import { motion } from 'framer-motion';
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
      <div className='account'>
        {accountData !== null &&
          <>
            <div className='icon'>
              <Identicon
                value={accountData.address}
                size='1.6rem'
              />
            </div>
            <h4>
              {clipAddress(accountData.address)}
              <div className='sep'></div> <span className='addr'>{accountData.meta.name}</span>
            </h4>
            <div>
              <motion.div
                className='copy'
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <button onClick={() => addNotification(notification)}>
                  <CopyToClipboard text={accountData.address}>
                    <FontAwesomeIcon icon={faCopy} transform="grow-1" />
                  </CopyToClipboard>
                </button>
              </motion.div>
            </div>
          </>
        }
        {accountData === null &&
          <>
            <h4 style={{ marginLeft: 0 }}>Account Not Connected</h4>
            <div></div>
          </>}
      </div>
      <Separator />
    </AccountWrapper>
  )
}

export default ActiveAccount;