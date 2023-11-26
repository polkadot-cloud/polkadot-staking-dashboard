// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
import React, { useEffect, useState } from 'react';
import { ItemsInner } from './itemsInner';

export class Items extends React.Component<any, any> {
  shouldComponentUpdate(nextProps: any) {
    return JSON.stringify(this.props.items) !== JSON.stringify(nextProps.items);
  }

  render() {
    return <ItemsInner {...this.props} />;
  }
}
