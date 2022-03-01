import React from 'react';
import { EntryWrapper } from './Wrappers';
import { APIContext } from './contexts/Api';
import Router from './Router';
import { NetworkMetricsContextWrapper } from './contexts/Network';
import { DEFAULT_NETWORK } from './constants';

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
        <EntryWrapper>
          <Router />
        </EntryWrapper>
      </NetworkMetricsContextWrapper>
    );
  }
}

export default Entry;