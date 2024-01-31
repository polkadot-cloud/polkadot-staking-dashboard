// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyApi } from '@polkadot-cloud/react/types';
import { useApi } from 'contexts/Api';

export const useIdentities = () => {
  const { api } = useApi();

  // Fetches validator identities.
  const fetchValidatorIdentities = async (addresses: string[]) => {
    if (!api) {
      return {};
    }

    const result = (await api.query.identity.identityOf.multi(addresses)).map(
      (identity) => identity.toHuman()
    );
    return Object.fromEntries(
      result.map((k, i) => [addresses[i], k]).filter(([, v]) => v !== null)
    );
  };

  // Fetch an array of super accounts and their identities.
  const fetchValidatorSupers = async (addresses: string[]) => {
    if (!api) {
      return {};
    }

    const supersRaw = (await api.query.identity.superOf.multi(addresses)).map(
      (superOf) => superOf.toHuman()
    );

    const supers = Object.fromEntries(
      supersRaw
        .map((k, i) => [
          addresses[i],
          {
            superOf: k,
          },
        ])
        .filter(([, { superOf }]: AnyApi) => superOf !== null)
    );

    const superIdentities = (
      await api.query.identity.identityOf.multi(
        Object.values(supers).map(({ superOf }: AnyApi) => superOf[0])
      )
    ).map((superIdentity) => superIdentity.toHuman());

    const supersWithIdentity = Object.fromEntries(
      Object.entries(supers).map(([k, v]: AnyApi, i) => [
        k,
        {
          ...v,
          identity: superIdentities[i],
        },
      ])
    );
    return supersWithIdentity;
  };

  // Fetches both identities and super identities from an array of addresses.
  const fetchIdentities = async (addresses: string[]) => {
    const [identities, supers] = await Promise.all([
      fetchValidatorIdentities(addresses),
      fetchValidatorSupers(addresses),
    ]);

    return { identities, supers };
  };

  return {
    fetchIdentities,
  };
};
