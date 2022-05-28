// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Wrapper, Labels } from './Wrappers';
import { useValidators } from '../../contexts/Validators';
import { getIdentityDisplay } from './Utils';
import { Favourite } from './Labels/Favourite';
import { Metrics } from './Labels/Metrics';
import { Identity } from './Labels/Identity';
import { CopyAddress } from './Labels/CopyAddress';
import { Oversubscribed } from './Labels/Oversubscribed';
import { Blocked } from './Labels/Blocked';

export const Default = (props: any) => {
  const { meta } = useValidators();

  const { validator, toggleFavourites, batchIndex, batchKey, showStatus } =
    props;
  const identities = meta[batchKey]?.identities ?? [];
  const supers = meta[batchKey]?.supers ?? [];

  const { address, prefs } = validator;
  const commission = prefs?.commission ?? null;

  return (
    <Wrapper showStatus={showStatus}>
      <div className="inner">
        <div className="row">
          <Identity
            validator={validator}
            batchIndex={batchIndex}
            batchKey={batchKey}
          />
          <div>
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
              <CopyAddress validator={validator} />
              {toggleFavourites && <Favourite address={address} />}
            </Labels>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default Default;
