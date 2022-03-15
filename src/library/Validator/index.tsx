// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Wrapper } from './Wrapper';
import Identicon from '@polkadot/react-identicon';
import { clipAddress } from '../../Utils';

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
        <div className='right'>
          <h4>{!synced ? '' : display === null ? clipAddress(address) : <b>{meta.identity.info.display.Raw}</b>}</h4>
        </div>
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
