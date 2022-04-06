// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { PageProps } from '../types';
import { useSubscan } from '../../contexts/Subscan';
import { GraphWrapper } from '../../library/Graphs/Wrappers';
import { PageRowWrapper } from '../../Wrappers';
import { SubscanButton } from '../../library/SubscanButton';
import { PayoutLine } from '../../library/Graphs/PayoutLine';
import { PayoutBar } from '../../library/Graphs/PayoutBar';
import moment from 'moment';
import { PageTitle } from '../../library/PageTitle';
import { useSize, formatSize } from '../../library/Graphs/Utils';

export const Payouts = (props: PageProps) => {

  const { payouts }: any = useSubscan();

  const { page } = props;
  const { title } = page;

  const ref: any = React.useRef();
  let size = useSize(ref.current);
  let { width, height, minHeight } = formatSize(size, 250);

  return (
    <>
      <PageTitle title={title} />
      <PageRowWrapper>
        <GraphWrapper>
          <SubscanButton />
          <div className='head'>
            <h4>Payout History</h4>
            <h2>
              {(payouts.length) ?
                <>
                  {moment.unix(payouts[0].block_timestamp).format('Do MMMM')} - {moment.unix(payouts[payouts.length - 1].block_timestamp).format('Do MMMM')}
                </>
                : <span className='fiat'>None</span>
              }
            </h2>
          </div>

          <div className='inner' ref={ref} style={{ minHeight: minHeight }}>
            <div className='graph' style={{ height: `${height}px`, width: `${width}px`, position: 'absolute' }}>
              <PayoutBar
                payouts={payouts.slice(0, 60)}
                height='120px'
              />
              <PayoutLine
                payouts={payouts.slice(0, 60)}
                height='70px'
              />
            </div>
          </div>
        </GraphWrapper>
      </PageRowWrapper>
    </>
  );
}

export default Payouts;