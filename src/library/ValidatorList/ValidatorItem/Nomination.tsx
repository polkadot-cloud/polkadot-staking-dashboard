// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useValidators } from 'contexts/Validators/ValidatorEntries';
import { ParaValidator } from 'library/ListItem/Labels/ParaValidator';
import { Labels, Separator, Wrapper } from 'library/ListItem/Wrappers';
import { Quartile } from 'library/ListItem/Labels/Quartile';
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
import { getIdentityDisplay } from './Utils';
import type { ValidatorItemProps } from './types';
import { Pulse } from './Pulse';

export const Nomination = ({
  validator,
  nominator,
  toggleFavorites,
  bondFor,
  displayFor,
  nominationStatus,
}: ValidatorItemProps) => {
  const { selectActive } = useList();
  const { validatorIdentities, validatorSupers } = useValidators();

  const { address, prefs } = validator;
  const commission = prefs?.commission ?? null;

  return (
    <Wrapper>
      <div className={`inner ${displayFor}`}>
        <div className="row top">
          {selectActive && <Select item={validator} />}
          <Identity address={address} />
          <div>
            <Labels className={displayFor}>
              <CopyAddress address={address} />
              {toggleFavorites && <FavoriteValidator address={address} />}
              <Metrics
                address={address}
                display={getIdentityDisplay(
                  validatorIdentities[address],
                  validatorSupers[address]
                )}
              />
            </Labels>
          </div>
        </div>
        <Separator />
        <div className="row bottom lg">
          <div>
            <Pulse address={address} displayFor={displayFor} />
          </div>
          <div>
            <Labels style={{ marginBottom: '0.9rem' }}>
              <Quartile address={address} />
              <Oversubscribed address={address} />
              <Blocked prefs={prefs} />
              <Commission commission={commission} />
              <ParaValidator address={address} />
            </Labels>
            <NominationStatus
              address={address}
              bondFor={bondFor}
              nominator={nominator}
              status={nominationStatus}
              noMargin
            />
          </div>
        </div>
      </div>
    </Wrapper>
  );
};
