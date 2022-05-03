// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { clipAddress } from '../../Utils';
import { Identicon } from '../../library/Identicon';
import { AccountWrapper } from './Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { motion } from 'framer-motion';
import { useNotifications } from '../../contexts/Notifications';

export const PoolAccount = (props: any) => {

  const { address } = props;
  const { addNotification } = useNotifications();

  const notification = {
    title: 'Address Copied to Clipboard',
    subtitle: address,
  };

  return (
    <AccountWrapper>
      <div className='account'>
        <div className='icon'>
          <Identicon
            value={address}
            size='1.6rem'
          />
        </div>
        <h4>{clipAddress(address)}</h4>
        <div>
          <motion.div
            className='copy'
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            <button onClick={() => addNotification(notification)}>
              <CopyToClipboard text={address}>
                <FontAwesomeIcon icon={faCopy} transform="grow-1" />
              </CopyToClipboard>
            </button>
          </motion.div>
        </div>
      </div>
    </AccountWrapper>
  )
}

export default PoolAccount;