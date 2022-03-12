// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import moment from 'moment';
import { PayoutLine } from '../../library/Graphs/PayoutLine';
import { PayoutBar } from '../../library/Graphs/PayoutBar';
import { planckToDot } from '../../Utils';
import {
  useApi
} from '../../contexts/Api';
export const PayoutsInner = (props: any) => {

  const { payouts } = props;
  const { network }: any = useApi();

  let lastPayout: any = null;

  if (payouts.length > 0) {
    let _last = payouts[payouts.length - 1];
    lastPayout = {
      amount: planckToDot(_last['amount']),
      block_timestamp: _last['block_timestamp'] + "",
    };
  }

  return (
    <>
      <h1>
        {lastPayout === null ? 0 : lastPayout.amount} {network.unit}&nbsp;<span className='fiat'>{lastPayout === null ? `` : moment.unix(lastPayout['block_timestamp']).fromNow()}</span>
      </h1>
      <div className='graph'>
        <PayoutBar
          payouts={payouts}
          height='200px'
        />
        <div style={{ marginTop: '1rem' }}>
          <PayoutLine
            payouts={payouts}
            height='80px'
          />
        </div>
      </div>
    </>
  );
}

export class Payouts extends React.Component<any, any> {

  // stop component refersh triggered by other API updates
  shouldComponentUpdate (nextProps: any, nextState: any) {
    let propsChanged = (nextProps.account !== this.props.account) || (nextProps.payouts !== this.props.payouts);
    return (propsChanged);
  }

  render () {
    return (
      <PayoutsInner {...this.props} />
    );
  }
}

export default Payouts;