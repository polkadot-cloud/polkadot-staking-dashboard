// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { SectionWrapper } from '../../library/Graphs/Wrappers';
import { OpenAssistantIcon } from '../../library/OpenAssistantIcon';
import { PoolAccount } from './PoolAccount';
import { SecondaryWrapper } from '../../library/Layout';
import { usePools } from '../../contexts/Pools';
import { useConnect } from '../../contexts/Connect';

export const Roles = () => {
  const { activeAccount } = useConnect();
  const { getAccountActivePool } = usePools();
  const activePool = getAccountActivePool(activeAccount);

  return (
    <SecondaryWrapper>
      <SectionWrapper style={{ height: 360 }}>
        <div className="head">
          <h2>Pool Roles</h2>
          <h4>
            Root <OpenAssistantIcon page="pools" title="Joined Pool" />
          </h4>
          <PoolAccount address={activePool?.roles?.root ?? null} />
          <h4>
            Depositor <OpenAssistantIcon page="pools" title="Joined Pool" />
          </h4>
          <PoolAccount address={activePool?.roles?.depositor ?? null} />
          <h4>
            Nominator <OpenAssistantIcon page="pools" title="Joined Pool" />
          </h4>
          <PoolAccount address={activePool?.roles?.nominator ?? null} />
          <h4>
            State Toggler
            <OpenAssistantIcon page="pools" title="Joined Pool" />
          </h4>
          <PoolAccount address={activePool?.roles?.stateToggler ?? null} last />
        </div>
      </SectionWrapper>
    </SecondaryWrapper>
  );
};

export default Roles;
