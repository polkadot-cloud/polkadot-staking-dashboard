// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { EntryWrapper } from './Wrappers';
import { APIContext } from './contexts/Api';
import Router from './Router';
import { NetworkMetricsContextWrapper } from './contexts/Network';
import { BalancesContextWrapper } from './contexts/Balances';
import { SubscanContextWrapper } from './contexts/Subscan';

export class Entry extends React.Component {

  static contextType?: React.Context<any> = APIContext;

  componentDidMount () {
    // set initial active network
    const network = localStorage.getItem('network');

    // initiate connection to Polakdot API
    this.context.connect(network);
  }

  // wrap entire router with network metrics: required for making staking calls
  render () {
    return (
      <NetworkMetricsContextWrapper>
        <BalancesContextWrapper>
          <SubscanContextWrapper>
            <EntryWrapper>
              <Router />
            </EntryWrapper>
          </SubscanContextWrapper>
        </BalancesContextWrapper>
      </NetworkMetricsContextWrapper>
    );
  }
}

export default Entry;