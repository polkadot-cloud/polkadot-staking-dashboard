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

  const { address, last } = props;
  const { addNotification } = useNotifications();

  let notification = {};

  if (address !== null) {
    notification = {
      title: 'Address Copied to Clipboard',
      subtitle: address,
    };
  }

  return (
    <AccountWrapper last={last}>
      <div className='account'>
        {address === null
          ? <h4>Not in a Pool</h4>
          : <>
            <div className='icon'>
              <Identicon
                value={address}
                size='1.6rem'
              />
            </div>
            <h4>{clipAddress(address)}</h4>
          </>
        }
        <div>
          <motion.div
            className='copy'
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >

            {address !== null &&
              <button onClick={() => addNotification(notification)}>
                <CopyToClipboard text={address}>
                  <FontAwesomeIcon icon={faCopy} transform="grow-1" />
                </CopyToClipboard>
              </button>
            }
          </motion.div>
        </div>
      </div>
    </AccountWrapper>
  )
}

export default PoolAccount;