// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { OpenAssistantIcon } from 'library/OpenAssistantIcon';
import { CardWrapper } from 'library/Graphs/Wrappers';
import { useNetworkMetrics } from 'contexts/Network';
import { useStaking } from 'contexts/Staking';
import useInflation from 'library/Hooks/useInflation';
import { toFixedIfNecessary } from 'Utils';
import { ReturnsWrapper } from './Wrappers';

export const Returns = (props: any) => {
  const { height } = props;
  const { metrics } = useNetworkMetrics();
  const { staking } = useStaking();
  const { inflation, stakedReturn } = useInflation();

  const { lastTotalStake } = staking;
  const { totalIssuance } = metrics;

  // total supply as percent
  let supplyAsPercent = 0;
  if (totalIssuance.gt(new BN(0))) {
    supplyAsPercent = lastTotalStake
      .div(totalIssuance.div(new BN(100)))
      .toNumber();
  }

  return (
    <CardWrapper height={height} flex>
      <ReturnsWrapper>
        <section>
          <div className="items">
            <div>
              <div className="inner">
                <h2>
                  {totalIssuance.toString() === '0'
                    ? '0'
                    : toFixedIfNecessary(stakedReturn, 2)}
                  %
                </h2>
                <h4>
                  Estimated Return{' '}
                  <OpenAssistantIcon page="overview" title="Your Balance" />
                </h4>
              </div>
            </div>
          </div>
        </section>
        <section>
          <div className="items">
            <div>
              <div className="inner">
                <h2>{supplyAsPercent}%</h2>
                <h4>
                  Supply Staked{' '}
                  <OpenAssistantIcon page="overview" title="Your Balance" />
                </h4>
              </div>
            </div>
            <div>
              <div className="inner">
                <h2>
                  {totalIssuance.toString() === '0'
                    ? '0'
                    : toFixedIfNecessary(inflation, 2)}
                  %
                </h2>
                <h4>
                  Inflation{' '}
                  <OpenAssistantIcon page="overview" title="Your Balance" />
                </h4>
              </div>
            </div>
          </div>
        </section>
      </ReturnsWrapper>
    </CardWrapper>
  );
};

export default Returns;
