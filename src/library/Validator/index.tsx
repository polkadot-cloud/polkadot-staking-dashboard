// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Wrapper } from './Wrapper';
import Identicon from '@polkadot/react-identicon';
import { clipAddress } from '../../Utils';
import { motion } from 'framer-motion';

export const ValidatorInner = (props: any) => {

  const { address, meta, synced } = props;

  let display = meta?.identity?.info?.display?.Raw ?? null;

  return (
    <Wrapper>
      <div>
        <Identicon
          value={address}
          size={26}
          theme="polkadot"
          style={{ cursor: 'default' }}
        />
        {synced &&
          <motion.div
            className='right'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.3 }}
          >
            <h4>{display === null ? clipAddress(address) : meta.identity.info.display.Raw}</h4>
          </motion.div>
        }
      </div>
    </Wrapper>
  )
}

export class Validator extends React.Component<any, any> {
  shouldComponentUpdate (nextProps: any, nextState: any) {
    return (this.props.meta !== nextProps.meta);
  }

  render () {
    return (
      <ValidatorInner {...this.props} />
    )
  }
}

export default Validator;
