// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import React from 'react';
import moment from 'moment';
import { PageProps } from '../types';
import { StatBoxList } from '../../library/StatBoxList';
import { useSubscan } from '../../contexts/Subscan';
import { useStaking } from '../../contexts/Staking';
import { useApi } from '../../contexts/Api';
import { GraphWrapper } from '../../library/Graphs/Wrappers';
import { PageRowWrapper } from '../../Wrappers';
import { SubscanButton } from '../../library/SubscanButton';
import { PayoutLine } from '../../library/Graphs/PayoutLine';
import { PayoutBar } from '../../library/Graphs/PayoutBar';
import { PageTitle } from '../../library/PageTitle';
import { useSize, formatSize } from '../../library/Graphs/Utils';
import { StatusLabel } from '../../library/StatusLabel';
import { OpenAssistantIcon } from '../../library/OpenAssistantIcon';
import { PayoutList } from './PayoutList';
import { SectionWrapper } from '../../library/Graphs/Wrappers';
import StatBoxListItem from '../../library/StatBoxList/Item';

export const Payouts = (props: PageProps) => {
  const { network }: any = useApi();
  const { staking }: any = useStaking();
  const { payouts }: any = useSubscan();
  const { unit, units } = network;
  const { lastReward } = staking;

  const { page } = props;
  const { title } = page;

  const ref: any = React.useRef();
  let size = useSize(ref.current);
  let { width, height, minHeight } = formatSize(size, 250);

  let lastRewardBase = lastReward.div(new BN(10 ** units)).toNumber();

  let items = [
    {
      format: 'number',
      params: {
        label: 'Last Era Payout',
        value: lastRewardBase,
        unit: unit,
        assistant: {
          page: 'payouts',
          key: 'Last Era Payout',
        },
      },
    },
  ];

  const payoutsList = [...payouts].reverse().slice(0, 60);

  return (
    <>
      <PageTitle title={title} />
      <StatBoxList>
        {items.map((item: any, index: number) => (
          <StatBoxListItem {...item} key={index} />
        ))}
      </StatBoxList>
      <PageRowWrapper>
        <GraphWrapper>
          <SubscanButton />
          <div className="head">
            <h4>
              Payout History
              <OpenAssistantIcon page="payouts" title="Payout History" />
            </h4>
            <h2>
              {payouts.length ? (
                <>
                  {moment.unix(payouts[0].block_timestamp).format('Do MMMM')} -{' '}
                  {moment
                    .unix(payouts[payouts.length - 1].block_timestamp)
                    .format('Do MMMM')}
                </>
              ) : (
                <span className="fiat">None</span>
              )}
            </h2>
          </div>
          <div className="inner" ref={ref} style={{ minHeight: minHeight }}>
            <StatusLabel topOffset="30%" title="Not Yet Staking" />
            <div
              className="graph"
              style={{
                height: `${height}px`,
                width: `${width}px`,
                position: 'absolute',
              }}
            >
              <PayoutBar payouts={payouts.slice(0, 60)} height="120px" />
              <PayoutLine payouts={payouts.slice(0, 60)} height="70px" />
            </div>
          </div>
        </GraphWrapper>
      </PageRowWrapper>
      {!payoutsList.length ? (
        <></>
      ) : (
        <PageRowWrapper noVerticalSpacer>
          <SectionWrapper>
            <PayoutList
              title="Recent Payouts"
              payouts={payoutsList}
              pagination
            />
          </SectionWrapper>
        </PageRowWrapper>
      )}
    </>
  );
};

export default Payouts;
