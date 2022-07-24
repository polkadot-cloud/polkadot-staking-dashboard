// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { OpenAssistantIcon } from 'library/OpenAssistantIcon';
import { CardWrapper } from 'library/Graphs/Wrappers';
import { ReturnsWrapper } from './Wrappers';

export const Returns = (props: any) => {
  const { height } = props;

  return (
    <CardWrapper height={height} flex>
      <ReturnsWrapper>
        <section>
          <h4>
            Returns
            <OpenAssistantIcon page="overview" title="Your Balance" />
          </h4>
          <div className="items">
            <div>
              <div className="inner">
                <h2>14.8%</h2>
                <h5>Expected Annual</h5>
              </div>
            </div>
          </div>
        </section>
        <section>
          <h4>
            Market
            <OpenAssistantIcon page="overview" title="Your Balance" />
          </h4>
          <div className="items">
            <div>
              <div className="inner">
                <h2>51%</h2>
                <h5>Supply Staked</h5>
              </div>
            </div>
            <div>
              <div className="inner">
                <h2>7.7%</h2>
                <h5>Inflation</h5>
              </div>
            </div>
          </div>
        </section>
      </ReturnsWrapper>
    </CardWrapper>
  );
};

export default Returns;
