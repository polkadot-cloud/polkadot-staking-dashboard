// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useRef } from 'react';
import { setStateWithRef } from 'Utils';
import { defaultExtrinsicsContext } from './defaults';
import { ExtrinsicsContextInterface } from './types';

export const ExtrinsicsContext =
  React.createContext<ExtrinsicsContextInterface>(defaultExtrinsicsContext);

export const useExtrinsics = () => React.useContext(ExtrinsicsContext);

export const ExtrinsicsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [pending, setPending] = useState<string[]>([]);
  const pendingRef = useRef(pending);

  const addPending = (nonce: string) => {
    const _pending: string[] = [...pendingRef.current];
    _pending.push(nonce);
    setStateWithRef(_pending, setPending, pendingRef);
  };

  const removePending = (nonce: string) => {
    const _pending = pendingRef.current.filter((n: string) => n !== nonce);
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
