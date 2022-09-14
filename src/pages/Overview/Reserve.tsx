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
  const { existentialAmount } = useBalances();

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
            <h2 className="reserve">
              <FontAwesomeIcon
                icon={faLock}
                transform="shrink-4"
                className="icon"
              />
              {`${toFixedIfNecessary(
                planckBnToUnit(existentialAmount, network.units),
                5
              )} ${network.unit}`}
            </h2>
          </section>
        </div>
      </ReserveWrapper>
    </SectionWrapper>
  );
};

export default Reserve;
