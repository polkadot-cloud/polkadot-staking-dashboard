// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useValidators } from 'contexts/Validators';
import { useValidatorList } from '../context';
import { Wrapper, Labels, Separator } from './Wrappers';
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
  const { selectActive, addToSelected, removeFromSelected, selected } =
    useValidatorList();

  const { validator, toggleFavourites, batchIndex, batchKey } = props;
  const identities = meta[batchKey]?.identities ?? [];
  const supers = meta[batchKey]?.supers ?? [];

  const { address, prefs } = validator;
  const commission = prefs?.commission ?? null;

  return (
    <Wrapper format="nomination">
      <div className="inner">
        <div className="row">
          {selectActive && (
            <input
              type="checkbox"
              onClick={() => {
                if (selected.includes(validator)) {
                  removeFromSelected([validator]);
                } else {
                  addToSelected(validator);
                }
              }}
            />
          )}
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
