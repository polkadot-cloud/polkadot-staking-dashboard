// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useRef } from 'react';
import { useMenu } from 'contexts/Menu';
import { Wrapper, Labels, Separator, MenuPosition } from './Wrappers';
import { useValidators } from '../../contexts/Validators';
import { getIdentityDisplay } from './Utils';
import { Favourite } from './Labels/Favourite';
import { Metrics } from './Labels/Metrics';
import { Identity } from './Labels/Identity';
import { CopyAddress } from './Labels/CopyAddress';
import { Oversubscribed } from './Labels/Oversubscribed';
import { Blocked } from './Labels/Blocked';
import { NominationStatus } from './Labels/NominationStatus';

export const Nomination = (props: any) => {
  const { meta } = useValidators();
  const { setMenuPosition }: any = useMenu();

  const { validator, toggleFavourites, batchIndex, batchKey } = props;
  const identities = meta[batchKey]?.identities ?? [];
  const supers = meta[batchKey]?.supers ?? [];

  const { address, prefs } = validator;
  const commission = prefs?.commission ?? null;

  const posRef = useRef(null);

  const toggleMenu = () => {
    setMenuPosition(posRef);
  };

  return (
    <Wrapper format="nomination">
      <MenuPosition ref={posRef} />
      <div className="inner">
        <div className="row">
          <Identity
            validator={validator}
            batchIndex={batchIndex}
            batchKey={batchKey}
          />
          <div>
            <Labels>
              <CopyAddress validator={validator} />
              {toggleFavourites && <Favourite address={address} />}
            </Labels>
          </div>
        </div>
        <Separator />
        <div className="row status">
          <NominationStatus address={address} />
          <button
            type="button"
            className="label ignore-open-menu-button"
            onClick={() => toggleMenu()}
          >
            Menu
          </button>
          <Labels>
            <Oversubscribed batchIndex={batchIndex} batchKey={batchKey} />
            <Blocked prefs={prefs} />
            <div className="label">{commission}%</div>
            <Metrics
              address={address}
              display={getIdentityDisplay(
                identities[batchIndex],
                supers[batchIndex]
              )}
            />
          </Labels>
        </div>
      </div>
    </Wrapper>
  );
};

export default Nomination;
