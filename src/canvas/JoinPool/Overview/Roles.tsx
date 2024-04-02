// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { CardWrapper } from 'library/Card/Wrappers';
import { AddressesWrapper, HeadingWrapper } from '../Wrappers';
import { ButtonHelp } from 'kits/Buttons/ButtonHelp';
import { useHelp } from 'contexts/Help';
import { AddressSection } from './AddressSection';
import type { OverviewSectionProps } from '../types';

export const Roles = ({ bondedPool }: OverviewSectionProps) => {
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
