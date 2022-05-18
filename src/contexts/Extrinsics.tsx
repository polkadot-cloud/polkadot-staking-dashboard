// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useRef } from 'react';

export interface ExtrinsicsContextState {
  addPending: (t: any) => void;
  removePending: (t: any) => void;
  pending: any;
}

export const ExtrinsicsContext: React.Context<ExtrinsicsContextState> = React.createContext({
  addPending: (t: any) => { },
  removePending: (t: any) => { },
  pending: [],
});

export const useExtrinsics = () => React.useContext(ExtrinsicsContext);

export const ExtrinsicsProvider = (props: any) => {
  const [pending, _setPending] = useState([]);
  const pendingRef = useRef(pending);

  const setPending = (_pending: any) => {
    pendingRef.current = _pending;
    _setPending(_pending);
  };

  const addPending = (nonce: any) => {
    const _pending: any = [...pendingRef.current];
    _pending.push(nonce);
    setPending(_pending);
  };

  const removePending = (nonce: any) => {
    const _pending = pendingRef.current.filter((item: any) => item !== nonce);
    setPending(_pending);
  };

  return (
    <ExtrinsicsContext.Provider value={{
      addPending,
      removePending,
      pending: pendingRef.current,
    }}
    >
      {props.children}
    </ExtrinsicsContext.Provider>
  );
};
