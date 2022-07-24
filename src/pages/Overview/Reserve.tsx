// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { OpenAssistantIcon } from 'library/OpenAssistantIcon';
import { SectionWrapper, ReserveWrapper, Separator } from './Wrappers';

export const Reserve = (props: any) => {
  const { height } = props;

  return (
    <SectionWrapper style={{ height }}>
      <ReserveWrapper>
        <Separator />
        <h4>
          Reserved Balance{' '}
          <OpenAssistantIcon page="overview" title="Your Balance" />
        </h4>

        <div className="inner">
          <section>
            <div className="items">
              <div className="main">
                <h2>1.5 DOT</h2>
              </div>
            </div>
          </section>
          <section>
            <div className="items">
              <div style={{ maxWidth: '10rem' }}>
                <h3 className="sec">1 DOT</h3>
                <h5>Existential Amount</h5>
              </div>
              <div className="sep">
                <h3>+</h3>
              </div>
              <div>
                <h3>0.5 DOT</h3>
                <h5>Reserved for Tx Fees</h5>
              </div>
            </div>
          </section>
        </div>
      </ReserveWrapper>
    </SectionWrapper>
  );
};

export default Reserve;
