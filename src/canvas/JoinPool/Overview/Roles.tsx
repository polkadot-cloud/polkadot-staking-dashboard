// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { BondedPool } from 'contexts/Pools/BondedPools/types';
import { CardWrapper } from 'library/Card/Wrappers';
import { AddressesWrapper, HeadingWrapper } from '../Wrappers';
import { ButtonHelp } from 'kits/Buttons/ButtonHelp';
import { useHelp } from 'contexts/Help';
import { AddressSection } from './AddressSection';

export const Roles = ({ bondedPool }: { bondedPool: BondedPool }) => {
  const { openHelp } = useHelp();

  return (
    <div>
      <CardWrapper className="canvas secondary">
        <HeadingWrapper>
          <h3>
            Pool Roles
            <ButtonHelp marginLeft onClick={() => openHelp('Pool Roles')} />
          </h3>
        </HeadingWrapper>

        <AddressesWrapper>
          {bondedPool.roles.root && (
            <AddressSection address={bondedPool.roles.root} label="Root" />
          )}
          {bondedPool.roles.nominator && (
            <AddressSection
              address={bondedPool.roles.nominator}
              label="Nominator"
            />
          )}
          {bondedPool.roles.bouncer && (
            <AddressSection
              address={bondedPool.roles.bouncer}
              label="Bounder"
            />
          )}
          {bondedPool.roles.depositor && (
            <AddressSection
              address={bondedPool.roles.depositor}
              label="Depositor"
            />
          )}
        </AddressesWrapper>
      </CardWrapper>
    </div>
  );
};
