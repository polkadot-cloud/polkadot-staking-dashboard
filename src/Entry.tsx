// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { EntryWrapper } from './Wrappers';
import Router from './Router';
import { NetworkMetricsContextWrapper } from './contexts/Network';
import { BalancesContextWrapper } from './contexts/Balances';

export class Entry extends React.Component {

  render () {
    return (
      <NetworkMetricsContextWrapper>
        <BalancesContextWrapper>
          <EntryWrapper>
            <Router />
          </EntryWrapper>
        </BalancesContextWrapper>
      </NetworkMetricsContextWrapper>
    );
  }
}

export default Entry;