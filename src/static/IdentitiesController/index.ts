// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyApi } from '@polkadot-cloud/react/types';
import { APIController } from '../APIController';

export class IdentitiesController {
  static fetch = async (addresses: string[]) => {
    const { api } = APIController;

    // Fetches identities for addresses.
    const fetchBase = async () => {
      const result = (await api.query.identity.identityOf.multi(addresses)).map(
        (identity) => identity.toHuman()
      );
      return Object.fromEntries(
        result.map((k, i) => [addresses[i], k]).filter(([, v]) => v !== null)
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

    const [identities, supers] = await Promise.all([
      fetchBase(),
      fetchSupers(),
    ]);

    return { identities, supers };
  };
}
