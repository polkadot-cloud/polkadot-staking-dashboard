// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useApi } from 'contexts/Api';
import { useBalances } from 'contexts/Balances';
import { OpenAssistantIcon } from 'library/OpenAssistantIcon';
import { planckBnToUnit, toFixedIfNecessary } from 'Utils';
import { SectionWrapper, ReserveWrapper, Separator } from './Wrappers';
import { ReserveProps } from './types';

export const Reserve = (props: ReserveProps) => {
  const { height } = props;
  const { network } = useApi();
  const { minReserve, existentialAmount, reserveAmount } = useBalances();

  return (
    <SectionWrapper style={{ height }}>
      <ReserveWrapper>
        <Separator />
        <h4>
          Reserved
          <OpenAssistantIcon page="overview" title="Your Balance" />
        </h4>

        <div className="inner">
          <section>
            <div className="items">
              <div className="main">
                <h2>
                  <FontAwesomeIcon icon={faLock} transform="shrink-4" />
                  &nbsp;
                  {`${toFixedIfNecessary(
                    planckBnToUnit(minReserve, network.units),
                    5
                  )} ${network.unit}`}
                </h2>
              </div>
            </div>
          </section>
          <section>
            <div className="items">
              <div style={{ maxWidth: '10rem' }}>
                <h3 className="sec">
                  {`${toFixedIfNecessary(
                    planckBnToUnit(existentialAmount, network.units),
                    5
                  )} ${network.unit}`}
                </h3>
                <h5>Existential Deposit</h5>
              </div>
              <div className="sep">
                <h3>+</h3>
              </div>
              <div>
                <h3>{`${toFixedIfNecessary(
                  planckBnToUnit(reserveAmount, network.units),
                  5
                )} ${network.unit}`}</h3>
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
