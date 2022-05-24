// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { SectionWrapper } from '../../../library/Graphs/Wrappers';
import { OpenAssistantIcon } from '../../../library/OpenAssistantIcon';
import { PoolAccount } from '../PoolAccount';
import { usePools } from '../../../contexts/Pools';
import { RolesWrapper } from './Wrappers';

export const Roles = () => {
  const { membership } = usePools();
  const activePool = membership?.pool;

  return (
    <SectionWrapper transparent>
      <div className="head">
        <h2>Manage Pool</h2>
      </div>
      <RolesWrapper>
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
      </RolesWrapper>
    </SectionWrapper>
  );
};

export default Roles;
