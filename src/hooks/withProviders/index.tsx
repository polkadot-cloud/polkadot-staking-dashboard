// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { FC } from 'react';
import type { AnyJson } from 'types';

// `providers` accepts standalone functional components or an array of a functional component and its props.
export type Provider = FC<AnyJson> | [FC<AnyJson>, AnyJson];

// A pure function that applies an arbitrary amount of context providers to a wrapped component.
export const withProviders = (providers: Provider[], Wrapped: FC) =>
  providers.reduceRight(
    (acc, prov) => {
      if (Array.isArray(prov)) {
        const Provider = prov[0];
        return <Provider {...prov[1]}>{acc}</Provider>;
      }
      const Provider = prov;
      return <Provider>{acc}</Provider>;
    },
    <Wrapped />
  );
