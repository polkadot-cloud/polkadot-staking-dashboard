// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { FC, RefObject } from 'react';
import { useEffect } from 'react';
import type { AnyFunction, AnyJson } from 'types';

/*
 * A hook that alerts clicks outside of the passed ref.
 */
export const useOutsideAlerter = (
  ref: RefObject<HTMLElement>,
  callback: AnyFunction,
  ignore: string[] = []
) => {
  useEffect(() => {
    const handleClickOutside = (event: AnyJson) => {
      if (ref.current && !ref.current.contains(event.target)) {
        const invalid = ignore.find((i: string) =>
          event.target.classList.contains(i)
        );
        if (invalid === undefined) {
          callback();
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);
};

// A pure function that applies an arbitrary amount of context providers to a wrapped
// component.
export const withProviders = (
  providers: (FC<AnyJson> | [FC<AnyJson>, AnyJson])[],
  Wrapped: FC
) =>
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
