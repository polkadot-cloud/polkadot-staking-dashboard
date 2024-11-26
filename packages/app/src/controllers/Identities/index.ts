// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ApiPromise } from '@polkadot/api';
import type { AnyJson } from '@w3ux/types';
import type { AnyApi } from 'types';

export class IdentitiesController {
  static fetch = async (api: ApiPromise, addresses: string[]) => {
    // Fetches identities for addresses.
    const fetchBase = async () => {
      const result = (await api.query.identity.identityOf.multi(addresses)).map(
        (identity) => identity.toHuman()
      );

      // Take identity data (first index) of results.
      const data = result.map(
        (resultArray: AnyJson | null) => resultArray?.[0] || null
      );

      return Object.fromEntries(
        data
          .map((key: string, index: number) => [addresses[index], key])
          .filter(([, value]) => value !== null)
      );
    };

    // Fetch an array of super accounts and their identities.
    const fetchSupers = async () => {
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

      // Take identity data (first index) of results.
      const data = superIdentities.map(
        (resultArray: AnyJson | null) => resultArray?.[0] || null
      );

      const supersWithIdentity = Object.fromEntries(
        Object.entries(supers).map(([k, v]: AnyApi, i) => [
          k,
          {
            ...v,
            identity: data[i],
          },
        ])
      );
      return supersWithIdentity;
    };

    const [identities, supers] = await Promise.all([
      fetchBase(),
      fetchSupers(),
    ]);

    return { identities, supers };
  };
}
