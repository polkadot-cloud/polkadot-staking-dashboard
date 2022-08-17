// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useValidators } from 'contexts/Validators';
import { Wrapper, Labels, Separator } from 'library/ListItem/Wrappers';
import { useValidatorList } from '../context';
import { getIdentityDisplay } from './Utils';
import { Favourite } from '../../ListItem/Labels/Favourite';
import { Metrics } from '../../ListItem/Labels/Metrics';
import { Identity } from '../../ListItem/Labels/Identity';
import { CopyAddress } from '../../ListItem/Labels/CopyAddress';
import { Oversubscribed } from '../../ListItem/Labels/Oversubscribed';
import { Blocked } from '../../ListItem/Labels/Blocked';
import { Select } from '../../ListItem/Labels/Select';
import { NominationStatus } from '../../ListItem/Labels/NominationStatus';
import { NominationProps } from './types';
import { Commission } from '../../ListItem/Labels/Commission';

export const Nomination = (props: NominationProps) => {
  const { meta } = useValidators();
  const { selectActive } = useValidatorList();

  const { validator, toggleFavourites, batchIndex, batchKey, bondType } = props;
  const identities = meta[batchKey]?.identities ?? [];
  const supers = meta[batchKey]?.supers ?? [];

  const { address, prefs } = validator;
  const commission = prefs?.commission ?? null;

  return (
    <Wrapper format="nomination">
      <div className="inner">
        <div className="row">
          {selectActive && <Select validator={validator} />}
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
          <NominationStatus address={address} bondType={bondType} />
          <Labels>
            <Oversubscribed batchIndex={batchIndex} batchKey={batchKey} />
            <Blocked prefs={prefs} />
            <Commission commission={commission} />
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
