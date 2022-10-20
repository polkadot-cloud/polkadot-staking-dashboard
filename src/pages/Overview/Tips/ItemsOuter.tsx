// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Items } from './Items';

export class ItemsOuter extends React.Component<any, any> {
  shouldComponentUpdate(nextProps: any) {
    return JSON.stringify(this.props.items) !== JSON.stringify(nextProps.items);
  }

  render() {
    return <Items {...this.props} />;
  }
}
