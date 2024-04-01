// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { BondedPool } from 'contexts/Pools/BondedPools/types';
import { CardWrapper } from 'library/Card/Wrappers';
import { AddressesWrapper, HeadingWrapper } from '../Wrappers';
import { useHelp } from 'contexts/Help';
import { ButtonHelp } from 'kits/Buttons/ButtonHelp';
import { Polkicon } from '@w3ux/react-polkicon';
import { ellipsisFn, remToUnit } from '@w3ux/utils';
import { CopyAddress } from 'library/ListItem/Labels/CopyAddress';

export const Addresses = ({ bondedPool }: { bondedPool: BondedPool }) => {
  const { openHelp } = useHelp();

  return (
    <CardWrapper className="canvas secondary">
      <AddressesWrapper>
        <section>
          <HeadingWrapper>
            <h3>
              Stash Address
              <ButtonHelp
                outline
                marginLeft
                onClick={() => openHelp('Era Points')}
              />
            </h3>
          </HeadingWrapper>

          <div className="addresses">
            <span>
              <Polkicon
                address={bondedPool.addresses.stash}
                size={remToUnit('2.5rem')}
                outerColor="transparent"
              />
            </span>
            <h4>
              {ellipsisFn(bondedPool.addresses.stash, 10)}
              <CopyAddress address={bondedPool.addresses.stash} />
            </h4>
          </div>
        </section>
        <section>
          <HeadingWrapper>
            <h3>
              Reward Address
              <ButtonHelp
                outline
                marginLeft
                onClick={() => openHelp('Era Points')}
              />
            </h3>
          </HeadingWrapper>
          <div className="addresses">
            <span>
              <Polkicon
                address={bondedPool.addresses.reward}
                size={remToUnit('2.5rem')}
                outerColor="transparent"
              />
            </span>
            <h4>
              {ellipsisFn(bondedPool.addresses.reward, 10)}{' '}
              <CopyAddress address={bondedPool.addresses.reward} />
            </h4>
          </div>
        </section>
      </AddressesWrapper>
    </CardWrapper>
  );
};
