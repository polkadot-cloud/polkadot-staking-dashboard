// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PageProps } from '../types';
import { useSubscan } from '../../contexts/Subscan';
import { GraphWrapper } from '../../library/Graphs/Wrappers';
import { PageRowWrapper } from '../../Wrappers';
import { SubscanButton } from '../../library/SubscanButton';
import { PayoutLine } from '../../library/Graphs/PayoutLine';
import { PayoutBar } from '../../library/Graphs/PayoutBar';

export const Payouts = (props: PageProps) => {

  const { payouts }: any = useSubscan();

  const { page } = props;
  const { title } = page;

  return (
    <>
      <h1 className='title'>{title}</h1>
      {/* <StatBoxList title="This Session" items={items} /> */}
      <PageRowWrapper>
        <GraphWrapper>
          <SubscanButton />
          <h3>Payout History [date from - date to]</h3>

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