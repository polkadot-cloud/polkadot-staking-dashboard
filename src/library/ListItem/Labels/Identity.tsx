// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ellipsisFn } from '@polkadot-cloud/utils';
import { useEffect, useState } from 'react';
import { useValidators } from 'contexts/Validators/ValidatorEntries';
import { AccountCard } from '@polkadot-cloud/react';
import { IdentityWrapper } from 'library/ListItem/Wrappers';
import type { TitleProps } from '@polkadot-cloud/react/recipes/AccountCard';
import { getIdentityDisplay } from '../../ValidatorList/ValidatorItem/Utils';
import type { IdentityProps } from '../types';

export const Identity = ({ address }: IdentityProps) => {
  const { validatorIdentities, validatorSupers } = useValidators();

  const [display, setDisplay] = useState(
    getIdentityDisplay(validatorIdentities[address], validatorSupers[address])
  );

  // aggregate synced status
  const identitiesSynced =
    Object.values(validatorIdentities).length > 0 ?? false;

  const supersSynced = Object.values(validatorSupers).length > 0 ?? false;

  useEffect(() => {
    setDisplay(
      getIdentityDisplay(validatorIdentities[address], validatorSupers[address])
    );
  }, [validatorSupers, validatorIdentities, address]);

  let titleProps: TitleProps = {
    address,
    justify: 'flex-start',
  };

  titleProps = Object.assign(
    titleProps,
    identitiesSynced && supersSynced && display !== null
      ? { component: display }
      : { name: ellipsisFn(address, 6) }
  );

  return (
    <IdentityWrapper
      className="identity"
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <AccountCard
        noCard
        fontSize="1.1rem"
        title={titleProps}
        icon={{
          size: 22,
          gridSize: 1,
          justify: 'flex-start',
        }}
      />
      {/* <Polkicon address={address} size="2rem" />
      <div className="inner">
        {validatorsFetched && display !== null ? (
          <h4>{display}</h4>
        ) : (
          <h4>{ellipsisFn(address, 6)}</h4>
        )}
      </div> */}
    </IdentityWrapper>
  );
};
