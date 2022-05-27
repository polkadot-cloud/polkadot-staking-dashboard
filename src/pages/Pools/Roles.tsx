// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { SectionHeaderWrapper } from '../../library/Graphs/Wrappers';
import { OpenAssistantIcon } from '../../library/OpenAssistantIcon';
import { PoolAccount } from './PoolAccount';
import { usePools } from '../../contexts/Pools';
import { RolesWrapper } from './ManagePool/Wrappers';

export const Roles = () => {
  const { isNominator, membership } = usePools();
  const activePool = membership?.pool;

  return (
    <>
      <SectionHeaderWrapper>
        <h2>Pool Roles</h2>
      </SectionHeaderWrapper>
      <RolesWrapper>
        <section>
          <div className="inner">
            <h3>
              Root
              <OpenAssistantIcon page="pools" title="Joined Pool" />
            </h3>
            <PoolAccount address={activePool?.roles?.root ?? null} />
          </div>
        </section>
        <section>
          <div className="inner">
            <h3>
              Depositor <OpenAssistantIcon page="pools" title="Joined Pool" />
            </h3>
            <PoolAccount address={activePool?.roles?.depositor ?? null} />
          </div>
        </section>
        <section>
          <div className="inner">
            <h3>
              Nominator <OpenAssistantIcon page="pools" title="Joined Pool" />
            </h3>
            <PoolAccount address={activePool?.roles?.nominator ?? null} />
          </div>
        </section>
        <section>
          <div className="inner">
            <h3>
              State Toggler
              <OpenAssistantIcon page="pools" title="Joined Pool" />
            </h3>
            <PoolAccount
              address={activePool?.roles?.stateToggler ?? null}
              last
            />
          </div>
        </section>
      </RolesWrapper>
    </>
  );
};

export default Roles;
