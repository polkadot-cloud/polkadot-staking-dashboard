// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useValidators } from 'contexts/Validators';
import { ParaValidator } from 'library/ListItem/Labels/ParaValidator';
import { Labels, Separator, Wrapper } from 'library/ListItem/Wrappers';
import { useList } from '../../List/context';
import { Blocked } from '../../ListItem/Labels/Blocked';
import { Commission } from '../../ListItem/Labels/Commission';
import { CopyAddress } from '../../ListItem/Labels/CopyAddress';
import { FavoriteValidator } from '../../ListItem/Labels/FavoriteValidator';
import { Identity } from '../../ListItem/Labels/Identity';
import { Metrics } from '../../ListItem/Labels/Metrics';
import { NominationStatus } from '../../ListItem/Labels/NominationStatus';
import { Oversubscribed } from '../../ListItem/Labels/Oversubscribed';
import { Select } from '../../ListItem/Labels/Select';
import { NominationProps } from './types';
import { getIdentityDisplay } from './Utils';

export const Nomination = (props: NominationProps) => {
  const { meta } = useValidators();
  const { selectActive } = useList();

  const {
    validator,
    nominator,
    toggleFavorites,
    batchIndex,
    batchKey,
    bondType,
    inModal,
  } = props;

  const identities = meta[batchKey]?.identities ?? [];
  const supers = meta[batchKey]?.supers ?? [];

  const { address, prefs } = validator;
  const commission = prefs?.commission ?? null;

  return (
    <Wrapper format="nomination" inModal={inModal}>
      <div className="inner">
        <div className="row">
          {selectActive && <Select item={validator} />}
          <Identity
            meta={meta}
            address={address}
            batchIndex={batchIndex}
            batchKey={batchKey}
          />
          <div>
            <Labels>
              <CopyAddress address={validator} />
              {toggleFavorites && <FavoriteValidator address={address} />}
            </Labels>
          </div>
        </div>
        <Separator />
        <div className="row status">
          <NominationStatus
            address={address}
            bondType={bondType}
            nominator={nominator}
          />
          <Labels>
            <Oversubscribed batchIndex={batchIndex} batchKey={batchKey} />
            <Blocked prefs={prefs} />
            <Commission commission={commission} />
            <ParaValidator address={address} />

            {/* restrict opening another modal within a modal */}
            {!inModal && (
              <Metrics
                address={address}
                display={getIdentityDisplay(
                  identities[batchIndex],
                  supers[batchIndex]
                )}
              />
            )}
          </Labels>
        </div>
      </div>
    </Wrapper>
  );
};

export default Nomination;
