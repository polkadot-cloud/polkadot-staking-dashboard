// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  SectionWrapper,
  SectionHeaderWrapper,
} from '../../../library/Graphs/Wrappers';
import { OpenAssistantIcon } from '../../../library/OpenAssistantIcon';
import { PoolAccount } from '../PoolAccount';
import { usePools } from '../../../contexts/Pools';
import { RolesWrapper } from './Wrappers';

export const Roles = () => {
  const { isNominator, membership } = usePools();
  const activePool = membership?.pool;

  return (
    <SectionWrapper transparent>
      <SectionHeaderWrapper>
        <h2>{isNominator() ? `Manage Pool` : `Pool`}</h2>
      </SectionHeaderWrapper>
      <RolesWrapper>
        <SectionHeaderWrapper>
          <h4>
            Root <OpenAssistantIcon page="pools" title="Joined Pool" />
          </h4>
          <PoolAccount address={activePool?.roles?.root ?? null} />
        </SectionHeaderWrapper>
        <SectionHeaderWrapper>
          <h4>
            Depositor <OpenAssistantIcon page="pools" title="Joined Pool" />
          </h4>
          <PoolAccount address={activePool?.roles?.depositor ?? null} />
        </SectionHeaderWrapper>
        <SectionHeaderWrapper>
          <h4>
            Nominator <OpenAssistantIcon page="pools" title="Joined Pool" />
          </h4>
          <PoolAccount address={activePool?.roles?.nominator ?? null} />
        </SectionHeaderWrapper>
        <SectionHeaderWrapper>
          <h4>
            State Toggler
            <OpenAssistantIcon page="pools" title="Joined Pool" />
          </h4>
          <PoolAccount address={activePool?.roles?.stateToggler ?? null} last />
        </SectionHeaderWrapper>
      </RolesWrapper>
    </SectionWrapper>
  );
};

export default Roles;
