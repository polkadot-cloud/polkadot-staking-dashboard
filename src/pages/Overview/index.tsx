// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PageProps } from '../types';
import { StatBoxList } from '../../library/StatBoxList';
import { useStakingMetrics } from '../../contexts/Staking';
import { PageRowWrapper } from '../../Wrappers';
import { MainWrapper, GraphWrapper, SecondaryWrapper } from './Wrappers';
import PayoutGraph from './PayoutGraph';
import BalanceGraph from './BalanceGraph';
import Announcements from './Announcements';
import { useApi } from '../../contexts/Api';
import { useConnect } from '../../contexts/Connect';
import { useSubscan } from '../../contexts/Subscan';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faProjectDiagram } from '@fortawesome/free-solid-svg-icons';

export const Overview = (props: PageProps) => {

  const { network }: any = useApi();
  const { activeAccount }: any = useConnect();
  const { staking }: any = useStakingMetrics();
  const { payouts }: any = useSubscan();

  // stats
  const items = [
    {
      label: "Total Nominators",
      value: staking.totalNominators,
      unit: "",
      format: "number",
    },
    {
      label: "Total Staked",
      value: staking.lastTotalStake,
      unit: network.unit,
      format: "number",
    },
    {
      label: "Last Reward Payout",
      value: staking.lastReward,
      unit: network.unit,
      format: "number",
    },
  ];

  const GRAPH_HEIGHT = 425;

  return (
    <>
      <h1>What's Happening</h1>
      <StatBoxList items={items} />
      <PageRowWrapper noVerticalSpacer>
        <SecondaryWrapper>
          <GraphWrapper style={{ minHeight: GRAPH_HEIGHT }} flex>
            <BalanceGraph />
          </GraphWrapper>
        </SecondaryWrapper>
        <MainWrapper paddingLeft>
          <GraphWrapper style={{ minHeight: GRAPH_HEIGHT }} flex>
            <div className='label'>
              <FontAwesomeIcon
                icon={faProjectDiagram}
                transform="shrink-2"
                style={{ marginRight: '0.3rem' }}
              />
              Subscan
            </div>
            <h5>Recent Payouts</h5>
            <PayoutGraph account={activeAccount} payouts={payouts} />
          </GraphWrapper>
        </MainWrapper>
      </PageRowWrapper>
      <PageRowWrapper>
        <Announcements />
      </PageRowWrapper>
    </>
  );
}

export default Overview;