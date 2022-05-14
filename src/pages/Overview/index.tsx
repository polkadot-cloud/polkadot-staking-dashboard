// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { StatBoxList } from '../../library/StatBoxList';
import { useStaking } from '../../contexts/Staking';
import { PageRowWrapper } from '../../Wrappers';
import { MainWrapper, SecondaryWrapper } from '../../library/Layout';
import { GraphWrapper } from '../../library/Graphs/Wrappers';
import Payouts from './Payouts';
import BalanceGraph from './BalanceGraph';
import Announcements from './Announcements';
import { useApi } from '../../contexts/Api';
import { useNetworkMetrics } from '../../contexts/Network';
import { useConnect } from '../../contexts/Connect';
import { useSubscan } from '../../contexts/Subscan';
import { SubscanButton } from '../../library/SubscanButton';
import { PageTitle } from '../../library/PageTitle';
import { planckToUnit } from '../../Utils';
import moment from 'moment';
import { GRAPH_HEIGHT } from '../../constants';
import { ActiveAccount } from './ActiveAccount';
import StatBoxListItem from '../../library/StatBoxList/Item';

export const Overview = () => {
  const { network, consts }: any = useApi();
  const { units } = network;
  const { maxElectingVoters } = consts;
  const { metrics }: any = useNetworkMetrics();
  const { totalIssuance } = metrics;
  const { activeAccount }: any = useConnect();
  const { staking, eraStakers }: any = useStaking();
  const { payouts }: any = useSubscan();

  const { totalNominators, maxNominatorsCount, lastTotalStake } = staking;

  const { activeNominators } = eraStakers;

  // total supply as percent
  let supplyAsPercent = 0;
  if (totalIssuance.gt(new BN(0))) {
    supplyAsPercent = lastTotalStake
      .div(totalIssuance.div(new BN(100)))
      .toNumber();
  }

  // total active nominators as percent
  let totalNominatorsAsPercent = 0;
  if (maxNominatorsCount.gt(new BN(0))) {
    totalNominatorsAsPercent = totalNominators
      .div(maxNominatorsCount.div(new BN(100)))
      .toNumber();
  }

  // active nominators as percent
  let activeNominatorsAsPercent = 0;
  if (maxElectingVoters > 0) {
    activeNominatorsAsPercent =
      activeNominators / new BN(maxElectingVoters).div(new BN(100)).toNumber();
  }

  // base values
  let lastTotalStakeBase = lastTotalStake.div(new BN(10 ** units));
  let totalIssuanceBase = totalIssuance.div(new BN(10 ** units));

  // stats
  const items = [
    {
      format: 'chart-pie',
      params: {
        label: 'Supply Staked',
        stat: {
          value: lastTotalStakeBase.toNumber(),
          unit: network.unit,
        },
        graph: {
          value1: lastTotalStakeBase.toNumber(),
          value2: totalIssuanceBase.sub(lastTotalStakeBase).toNumber(),
        },

        tooltip: `${supplyAsPercent.toFixed(2)}%`,
        assistant: {
          page: 'overview',
          key: 'Supply Staked',
        },
      },
    },
    {
      format: 'chart-pie',
      params: {
        label: 'Total Nominators',
        stat: {
          value: totalNominators.toNumber(),
          total: maxNominatorsCount,
          unit: '',
        },
        graph: {
          value1: totalNominators.toNumber(),
          value2: maxNominatorsCount.sub(totalNominators).toNumber(),
        },

        tooltip: `${totalNominatorsAsPercent.toFixed(2)}%`,
        assistant: {
          page: 'overview',
          key: 'Nominators',
        },
      },
    },
    {
      format: 'chart-pie',
      params: {
        label: 'Active Nominators',
        stat: {
          value: activeNominators,
          total: maxElectingVoters,
          unit: '',
        },
        graph: {
          value1: activeNominators,
          value2: maxElectingVoters - activeNominators,
        },
        tooltip: `${activeNominatorsAsPercent.toFixed(2)}%`,
        assistant: {
          page: 'overview',
          key: 'Active Nominators',
        },
      },
    },
  ];

  // get last payout
  let lastPayout: any = null;
  if (payouts.length > 0) {
    let _last = payouts[payouts.length - 1];
    lastPayout = {
      amount: planckToUnit(_last['amount'], units),
      block_timestamp: _last['block_timestamp'] + '',
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
        {items.map((item: any, index: number) => (
          <StatBoxListItem {...item} key={index} />
        ))}
      </StatBoxList>
      <PageRowWrapper noVerticalSpacer>
        <SecondaryWrapper>
          <GraphWrapper flex>
            <ActiveAccount />
            <BalanceGraph />
          </GraphWrapper>
        </SecondaryWrapper>
        <MainWrapper paddingLeft>
          <GraphWrapper style={{ minHeight: GRAPH_HEIGHT }} flex>
            <SubscanButton />
            <div className="head">
              <h4>Recent Payouts</h4>
              <h2>
                {lastPayout === null ? 0 : lastPayout.amount} {network.unit}
                &nbsp;
                <span className="fiat">
                  {lastPayout === null
                    ? ``
                    : moment.unix(lastPayout['block_timestamp']).fromNow()}
                </span>
              </h2>
            </div>
            <Payouts
              account={activeAccount}
              payouts={payouts.slice(payoutsStart, payoutsEnd)}
            />
          </GraphWrapper>
        </MainWrapper>
      </PageRowWrapper>
      <PageRowWrapper noVerticalSpacer>
        <Announcements />
      </PageRowWrapper>
    </>
  );
};

export default Overview;
