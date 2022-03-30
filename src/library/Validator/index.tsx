// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Wrapper } from './Wrapper';
import Identicon from '@polkadot/react-identicon';
import { clipAddress } from '../../Utils';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStopCircle, faUserSlash } from '@fortawesome/free-solid-svg-icons';
import { useApi } from '../../contexts/Api';

export const ValidatorInner = (props: any) => {

  const { consts }: any = useApi();

  const { validator, synced, identity, stake } = props;

  let { address, prefs } = validator;
  let display = identity?.info?.display?.Raw ?? null;

  let commission = prefs?.commission ?? null;
  let blocked = prefs?.blocked ?? null;

  let total_nominations = stake?.total_nominations ?? 0;

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
        <div className='labels'>
          <label>
            {commission}%
          </label>
          {blocked &&
            <label>
              <FontAwesomeIcon
                icon={faUserSlash}
                color='#d2545d'
                transform="shrink-1"
                style={{ marginRight: '0.25rem' }}
              />
            </label>
          }
        </div>
        {(synced.stake && total_nominations >= consts.maxNominatorRewardedPerValidator) &&
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            <label>
              <FontAwesomeIcon
                icon={faStopCircle}
                color='#d2545d'
                transform="grow-1"
                style={{ marginLeft: '0.75rem' }}
              />
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
