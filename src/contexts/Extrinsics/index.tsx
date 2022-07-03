// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useRef } from 'react';
import { setStateWithRef } from 'Utils';
import { defaultExtrinsicsContext } from './defaults';

export interface ExtrinsicsContextInterface {
  addPending: (n: number) => void;
  removePending: (n: number) => void;
  pending: number[];
}

export const ExtrinsicsContext =
  React.createContext<ExtrinsicsContextInterface>(defaultExtrinsicsContext);

export const useExtrinsics = () => React.useContext(ExtrinsicsContext);

export const ExtrinsicsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [pending, setPending] = useState<number[]>([]);
  const pendingRef = useRef(pending);

  const addPending = (nonce: number) => {
    const _pending: number[] = [...pendingRef.current];
    _pending.push(nonce);
    setStateWithRef(_pending, setPending, pendingRef);
  };

  const removePending = (nonce: number) => {
    const _pending = pendingRef.current.filter((n: number) => n !== nonce);
    setStateWithRef(_pending, setPending, pendingRef);
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
