// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/types';
import type { PapiApi } from 'model/Api/types';
import { IdentityOfMulti, SuperOfMulti } from 'node-api/queryMulti';
import type { AnyApi } from 'types';

export class Identities {
  static fetch = async (api: PapiApi, addresses: string[]) => {
    // Fetches identities for addresses.
    const fetchBase = async () => {
      const addressesMulti: [string][] = addresses.map((address) => [address]);
      const result = await new IdentityOfMulti(api, addressesMulti).fetch();

      // Take identity data (first index) of results.
      const data =
        result?.map(
          (resultArray: AnyJson | null) => resultArray?.[0] || null
        ) || [];

      return Object.fromEntries(
        data
          .map((key: string, index: number) => [addresses[index], key])
          .filter(([, value]) => value !== null)
      );
    };

    // Fetch an array of super accounts and their identities.
    const fetchSupers = async () => {
      const addressesMulti: [string][] = addresses.map((address) => [address]);
      const supersRawMulti = await new SuperOfMulti(
        api,
        addressesMulti
      ).fetch();

      const supers = Object.fromEntries(
        (supersRawMulti || [])
          .map((k, i) => [
            addresses[i],
            {
              superOf: k,
            },
          ])
          .filter(([, { superOf }]: AnyApi) => superOf !== undefined)
      );

      const superOfMulti: [string][] = Object.values(supers).map(
        ({ superOf }: AnyApi) => [superOf[0]]
      );
      const superIdentities =
        (await new IdentityOfMulti(api, superOfMulti).fetch()) || [];

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
