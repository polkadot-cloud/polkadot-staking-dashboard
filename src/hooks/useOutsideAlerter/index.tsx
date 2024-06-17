// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, type RefObject } from 'react';
import type { AnyFunction, AnyJson } from '@w3ux/types';

// A hook that alerts clicks outside of the passed ref.
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
