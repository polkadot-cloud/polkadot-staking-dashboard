// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useRef } from 'react';
import type { AnyApi, AnyFunction } from 'types';

export const useEffectIgnoreInitial = (fn: AnyFunction, deps: AnyApi[]) => {
  const isInitial = useRef<boolean>(true);

  useEffect(
    () => {
      if (!isInitial.current) {
        fn();
      }
      isInitial.current = false;
    },
    deps ? [...deps] : undefined
  );
};
