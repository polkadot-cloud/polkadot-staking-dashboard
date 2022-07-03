// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import moment from 'moment';
import { StatBoxList } from 'library/StatBoxList';
import { useSubscan } from 'contexts/Subscan';
import { useUi } from 'contexts/UI';
import {
  GraphWrapper,
  CardWrapper,
  CardHeaderWrapper,
} from 'library/Graphs/Wrappers';
import { PageRowWrapper } from 'Wrappers';
import { SubscanButton } from 'library/SubscanButton';
import { PayoutLine } from 'library/Graphs/PayoutLine';
import { PayoutBar } from 'library/Graphs/PayoutBar';
import { PageTitle } from 'library/PageTitle';
import {
  useSize,
  formatSize,
  prefillToMaxDays,
  calculatePayoutsByDay,
} from 'library/Graphs/Utils';
import { StatusLabel } from 'library/StatusLabel';
import { OpenAssistantIcon } from 'library/OpenAssistantIcon';
import { useApi } from 'contexts/Api';
import { PageProps } from '../types';
import { PayoutList } from './PayoutList';
import LastEraPayoutStatBox from './Stats/LastEraPayout';

export const Payouts = (props: PageProps) => {
  const { network } = useApi();
  const { payouts } = useSubscan();
  const { services } = useUi();
  const { units } = network;
  const { page } = props;
  const { title } = page;

  const ref: any = React.useRef();
  const size = useSize(ref.current);
  const { width, height, minHeight } = formatSize(size, 250);

  // generate payouts by day data
  const maxDays = 60;
  let payoutsByDay = prefillToMaxDays(
    calculatePayoutsByDay(payouts, maxDays, units),
    maxDays
  );

  // reverse payouts: most recent last
  payoutsByDay = payoutsByDay.reverse();

  // take non-zero payouts in most-recent order
  const payoutsList = [...payouts.filter((p: any) => p.amount > 0)].slice(
    0,
    maxDays
  );

  return (
    <>
      <PageTitle title={title} />
      <StatBoxList>
        <LastEraPayoutStatBox />
      </StatBoxList>
      <PageRowWrapper className="page-padding" noVerticalSpacer>
        <GraphWrapper>
          <SubscanButton />
          <CardHeaderWrapper padded>
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
          </CardHeaderWrapper>
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
              <PayoutBar payouts={payoutsByDay} height="120px" />
              <PayoutLine payouts={payoutsByDay} height="70px" />
            </div>
          </div>
        </GraphWrapper>
      </PageRowWrapper>
      {!payoutsList.length ? (
        <></>
      ) : (
        <PageRowWrapper className="page-padding" noVerticalSpacer>
          <CardWrapper>
            <PayoutList
              title="Recent Payouts"
              payouts={payoutsList}
              pagination
            />
          </CardWrapper>
        </PageRowWrapper>
      )}
    </>
  );
};

export default Payouts;
