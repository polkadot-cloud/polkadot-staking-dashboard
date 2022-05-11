// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { PayoutLine } from '../../library/Graphs/PayoutLine';
import { PayoutBar } from '../../library/Graphs/PayoutBar';
import { useSize, formatSize } from '../../library/Graphs/Utils';
import { StatusLabel } from '../../library/StatusLabel';

export const PayoutsInner = (props: any) => {

  const { payouts } = props;

  const ref: any = React.useRef();
  let size = useSize(ref.current);
  let { width, height, minHeight } = formatSize(size, 352);

  return (
    <>
      <div className='inner' ref={ref} style={{ minHeight: minHeight }}>
        <StatusLabel title="Not Yet Staking" />
        <div className='graph' style={{ height: `${height}px`, width: `${width}px`, position: 'absolute' }}>
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