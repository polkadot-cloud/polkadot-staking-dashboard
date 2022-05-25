// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import moment from 'moment';
import { PageProps } from '../types';
import { StatBoxList } from '../../library/StatBoxList';
import { useSubscan } from '../../contexts/Subscan';
import { useUi } from '../../contexts/UI';
import {
  GraphWrapper,
  SectionWrapper,
  SectionHeaderWrapper,
} from '../../library/Graphs/Wrappers';
import { PageRowWrapper } from '../../Wrappers';
import { SubscanButton } from '../../library/SubscanButton';
import { PayoutLine } from '../../library/Graphs/PayoutLine';
import { PayoutBar } from '../../library/Graphs/PayoutBar';
import { PageTitle } from '../../library/PageTitle';
import {
  useSize,
  formatSize,
  prefillPayoutGraph,
} from '../../library/Graphs/Utils';
import { StatusLabel } from '../../library/StatusLabel';
import { OpenAssistantIcon } from '../../library/OpenAssistantIcon';
import { PayoutList } from './PayoutList';
import LastEraPayoutStatBox from './Stats/LastEraPayout';

export const Payouts = (props: PageProps) => {
  const { payouts }: any = useSubscan();
  const { services }: any = useUi();

  const { page } = props;
  const { title } = page;

  const ref: any = React.useRef();
  const size = useSize(ref.current);
  const { width, height, minHeight } = formatSize(size, 250);

  // pre-fill missing items if payouts < 60
  const payoutsGraph = prefillPayoutGraph([...payouts], 60);

  // take payouts in most-recent order
  const payoutsList = [...payouts].reverse().slice(0, 60);

  return (
    <>
      <PageTitle title={title} />
      <StatBoxList>
        <LastEraPayoutStatBox />
      </StatBoxList>
      <PageRowWrapper className="page-padding" noVerticalSpacer>
        <GraphWrapper>
          <SubscanButton />
          <SectionHeaderWrapper padded>
            <h4>
              Payout History
              <OpenAssistantIcon page="payouts" title="Payout History" />
            </h4>
            <h2>
              {payouts.length ? (
                <>
                  {moment.unix(payouts[0].block_timestamp).format('Do MMMM')}
                  &nbsp;-&nbsp;
                  {moment
                    .unix(payouts[payouts.length - 1].block_timestamp)
                    .format('Do MMMM')}
                </>
              ) : (
                'None'
              )}
            </h2>
          </SectionHeaderWrapper>
          <div className="inner" ref={ref} style={{ minHeight }}>
            {!services.includes('subscan') ? (
              <StatusLabel
                status="active_service"
                statusFor="subscan"
                title="Subscan Disabled"
              />
            ) : (
              <StatusLabel status="sync_or_setup" title="Not Staking" />
            )}

            <div
              className="graph"
              style={{
                height: `${height}px`,
                width: `${width}px`,
                position: 'absolute',
              }}
            >
              <PayoutBar payouts={payoutsGraph} height="120px" />
              <PayoutLine payouts={payoutsGraph} height="70px" />
            </div>
          </div>
        </GraphWrapper>
      </PageRowWrapper>
      {!payoutsList.length ? (
        <></>
      ) : (
        <PageRowWrapper className="page-padding" noVerticalSpacer>
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
