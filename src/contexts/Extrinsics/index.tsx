// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { setStateWithRef } from '@polkadot-cloud/utils';
import type { ReactNode } from 'react';
import { createContext, useContext, useRef, useState } from 'react';
import { defaultExtrinsicsContext } from './defaults';
import type { ExtrinsicsContextInterface } from './types';

export const ExtrinsicsContext = createContext<ExtrinsicsContextInterface>(
  defaultExtrinsicsContext
);

export const useExtrinsics = () => useContext(ExtrinsicsContext);

export const ExtrinsicsProvider = ({ children }: { children: ReactNode }) => {
  const [pending, setPending] = useState<string[]>([]);
  const pendingRef = useRef(pending);

  const addPending = (nonce: string) => {
    setStateWithRef(
      [...pendingRef.current].concat(nonce),
      setPending,
      pendingRef
    );
  };

  const removePending = (nonce: string) => {
    setStateWithRef(
      pendingRef.current.filter((n: string) => n !== nonce),
      setPending,
      pendingRef
    );
  };

  return (
    <ExtrinsicsContext.Provider
      value={{
        addPending,
        removePending,
        pending: pendingRef.current,
      }}
    >
      {children}
    </ExtrinsicsContext.Provider>
  );
};
