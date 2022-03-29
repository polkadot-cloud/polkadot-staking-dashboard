// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Wrapper } from './Wrapper';
import Identicon from '@polkadot/react-identicon';
import { clipAddress } from '../../Utils';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPercentage } from '@fortawesome/free-solid-svg-icons';

export const ValidatorInner = (props: any) => {

  const { synced, address, identity, prefs } = props;

  let display = identity?.info?.display?.Raw ?? null;

  // prefs.commission
  // prefs.blocked

  return (
    <Wrapper>
      <div>
        <Identicon
          value={address}
          size={26}
          theme="polkadot"
          style={{ cursor: 'default' }}
        />
        {synced.identities &&
          <motion.div
            className='identity'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            <h4>{display === null ? clipAddress(address) : identity.info.display.Raw}</h4>
          </motion.div>
        }
        {synced.prefs &&
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            <label>
              <FontAwesomeIcon
                icon={faPercentage}
                transform="shrink-1"
                style={{ marginRight: '0.25rem' }}
              />
              {prefs.commission}
            </label>
          </motion.div>
        }
      </div>
    </Wrapper>
  )
}

export class Validator extends React.Component<any, any> {
  shouldComponentUpdate (nextProps: any, nextState: any) {
    return (this.props !== nextProps);
  }

  render () {
    return (
      <ValidatorInner {...this.props} />
    )
  }
}

export default Validator;
