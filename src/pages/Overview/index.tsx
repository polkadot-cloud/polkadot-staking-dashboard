// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import moment from 'moment';
import { StatBoxList } from 'library/StatBoxList';
import {
  PageRowWrapper,
  RowPrimaryWrapper,
  RowSecondaryWrapper,
} from 'Wrappers';
import { GraphWrapper } from 'library/Graphs/Wrappers';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useSubscan } from 'contexts/Subscan';
import { SubscanButton } from 'library/SubscanButton';
import { PageTitle } from 'library/PageTitle';
import { GRAPH_HEIGHT } from 'consts';
import { APIContextInterface } from 'types/api';
import { ConnectContextInterface } from 'types/connect';
import { prefillToMaxDays, calculatePayoutsByDay } from 'library/Graphs/Utils';
import { planckBnToUnit } from 'Utils';
import { ActiveAccount } from './ActiveAccount';
import TotalNominatorsStatBox from './Stats/TotalNominators';
import SupplyStakedStatBox from './Stats/SupplyStaked';
import { ActiveNominatorsStatBox } from './Stats/ActiveNominators';
import Announcements from './Announcements';
import BalanceGraph from './BalanceGraph';
import Payouts from './Payouts';

export const Overview = () => {
  const { network } = useApi() as APIContextInterface;
  const { units } = network;
  const { activeAccount } = useConnect() as ConnectContextInterface;
  const { payouts }: any = useSubscan();

  // generate payouts by day data
  const maxDays = 14;
  let payoutsByDay = prefillToMaxDays(
    calculatePayoutsByDay(payouts, maxDays, units),
    maxDays
  );

  // reverse payouts: most recent last
  payoutsByDay = payoutsByDay.reverse();

  // get most recent payout
  const lastPayout =
    payouts.find((p: any) => new BN(p.amount).gt(new BN(0))) ?? null;

  return (
    <>
      <PageTitle title="Overview" />
      <StatBoxList>
        <SupplyStakedStatBox />
        <TotalNominatorsStatBox />
        <ActiveNominatorsStatBox />
      </StatBoxList>
      <PageRowWrapper className="page-padding" noVerticalSpacer>
        <RowSecondaryWrapper hOrder={0} vOrder={0}>
          <GraphWrapper style={{ minHeight: GRAPH_HEIGHT }} flex>
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
                {lastPayout === null
                  ? 0
                  : planckBnToUnit(new BN(lastPayout.amount), units)}
                &nbsp;{network.unit}
                &nbsp;
                <span className="fiat">
                  {lastPayout === null
                    ? ''
                    : moment.unix(lastPayout.block_timestamp).fromNow()}
                </span>
              </h2>
            </div>
            <Payouts account={activeAccount} payouts={payoutsByDay} />
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
