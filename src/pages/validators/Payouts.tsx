// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PageProps } from '../types';
import { useSubscan } from '../../contexts/Subscan';
import { GraphWrapper } from '../../library/Graphs/Wrappers';
import { PageRowWrapper } from '../../Wrappers';
import { SubscanButton } from '../../library/SubscanButton';
import { PayoutLine } from '../../library/Graphs/PayoutLine';
import { PayoutBar } from '../../library/Graphs/PayoutBar';
import moment from 'moment';
import { PageTitle } from '../../library/PageTitle';

export const Payouts = (props: PageProps) => {

  const { payouts }: any = useSubscan();

  const { page } = props;
  const { title } = page;

  return (
    <>
      <PageTitle title={title} />
      <PageRowWrapper>
        <GraphWrapper>
          <SubscanButton />
          <h3>Payout History</h3>
          <h1>
            {(payouts.length) ?
              <span className='fiat'>
                {moment.unix(payouts[0].block_timestamp).format('Do MMMM')} - {moment.unix(payouts[payouts.length - 1].block_timestamp).format('Do MMMM')}
              </span>
              : <span className='fiat'>None</span>
            }
          </h1>

          <div className='graph'>
            <PayoutBar
              payouts={payouts.slice(0, 60)}
              height='120px'
            />
            <PayoutLine
              payouts={payouts.slice(0, 60)}
              height='70px'
            />
          </div>
        </GraphWrapper>
      </PageRowWrapper>
    </>
  );
}

export default Payouts;