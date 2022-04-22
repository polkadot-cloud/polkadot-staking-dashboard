// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { clipAddress } from '../../Utils';
import { Identicon } from '../../library/Identicon';
import { Separator, AccountWrapper } from './Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useConnect } from '../../contexts/Connect';
import { motion } from 'framer-motion';

export const ActiveAccount = () => {

  const { activeAccount, getAccount }: any = useConnect();
  const accountData = getAccount(activeAccount);

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
            <h4>{clipAddress(accountData.address)}<div className='sep'></div> <span className='addr'>{accountData.name}</span></h4>
            <div>
              <motion.div
                className='copy'
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <CopyToClipboard text={accountData.address}>
                  <FontAwesomeIcon icon={faCopy} />
                </CopyToClipboard>
              </motion.div>
            </div>
          </>
        }
      </div>
      <Separator />
    </AccountWrapper>
  )
}

export default ActiveAccount;