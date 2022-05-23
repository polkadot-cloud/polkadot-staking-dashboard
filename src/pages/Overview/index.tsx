// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import moment from 'moment';
import { StatBoxList } from '../../library/StatBoxList';
import {
  PageRowWrapper,
  RowPrimaryWrapper,
  RowSecondaryWrapper,
} from '../../Wrappers';
import { GraphWrapper } from '../../library/Graphs/Wrappers';
import Payouts from './Payouts';
import BalanceGraph from './BalanceGraph';
import Announcements from './Announcements';
import { useApi } from '../../contexts/Api';
import { useConnect } from '../../contexts/Connect';
import { useSubscan } from '../../contexts/Subscan';
import { SubscanButton } from '../../library/SubscanButton';
import { PageTitle } from '../../library/PageTitle';
import { planckToUnit } from '../../Utils';
import { GRAPH_HEIGHT } from '../../constants';
import { ActiveAccount } from './ActiveAccount';
import TotalNominatorsStatBox from './Stats/TotalNominators';
import SupplyStakedStatBox from './Stats/SupplyStaked';
import { ActiveNominatorsStatBox } from './Stats/ActiveNominators';

export const Overview = () => {
  const { network }: any = useApi();
  const { units } = network;
  const { activeAccount }: any = useConnect();
  const { payouts }: any = useSubscan();

  // get last payout
  let lastPayout: any = null;
  if (payouts.length > 0) {
    const _last = payouts[payouts.length - 1];
    lastPayout = {
      amount: planckToUnit(_last.amount, units),
      block_timestamp: `${_last.block_timestamp}`,
    };
  }

  // payouts thresholds
  let payoutsEnd = payouts.length;
  payoutsEnd = payoutsEnd < 0 ? 0 : payoutsEnd;

  let payoutsStart = payoutsEnd - 10;
  payoutsStart = payoutsStart < 0 ? 0 : payoutsStart;

  return (
    <>
      <PageTitle title="What's Happening" />
      <StatBoxList>
        <SupplyStakedStatBox />
        <TotalNominatorsStatBox />
        <ActiveNominatorsStatBox />
      </StatBoxList>
      <PageRowWrapper className="page-padding" noVerticalSpacer>
        <RowSecondaryWrapper hOrder={0} vOrder={0}>
          <GraphWrapper flex>
            <ActiveAccount />
            <BalanceGraph />
          </GraphWrapper>
        </RowSecondaryWrapper>
        <RowPrimaryWrapper hOrder={1} vOrder={1}>
          <GraphWrapper style={{ minHeight: GRAPH_HEIGHT }} flex>
            <SubscanButton />
            <div className="head">
              <h4>Recent Payouts</h4>
              <h2>
                <span className="amount">
                  {lastPayout === null ? 0 : lastPayout.amount}
                </span>
                &nbsp;{network.unit}
                &nbsp;
                <span className="fiat">
                  {lastPayout === null
                    ? ''
                    : moment.unix(lastPayout.block_timestamp).fromNow()}
                </span>
              </h2>
            </div>
            <Payouts
              account={activeAccount}
              payouts={payouts.slice(payoutsStart, payoutsEnd)}
            />
          </GraphWrapper>
        </RowPrimaryWrapper>
      </PageRowWrapper>
      <PageRowWrapper className="page-padding" noVerticalSpacer>
        <Announcements />
      </PageRowWrapper>
    </>
  );
};

export default Overview;
