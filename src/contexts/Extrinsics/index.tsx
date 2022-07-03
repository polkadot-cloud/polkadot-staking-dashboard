// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useRef } from 'react';
import { setStateWithRef } from 'Utils';
import { defaultExtrinsicsContext } from './defaults';

export interface ExtrinsicsContextInterface {
  addPending: (t: any) => void;
  removePending: (t: any) => void;
  pending: any;
}

export const ExtrinsicsContext = React.createContext<ExtrinsicsContextInterface>(
  defaultExtrinsicsContext
);

export const useExtrinsics = () => React.useContext(ExtrinsicsContext);

export const ExtrinsicsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [pending, setPending] = useState([]);
  const pendingRef = useRef(pending);

  const addPending = (nonce: any) => {
    const _pending: any = [...pendingRef.current].concat(nonce);
    setStateWithRef(_pending, setPending, pendingRef);
  };

  const removePending = (nonce: any) => {
    const _pending = pendingRef.current.filter((item: any) => item !== nonce);
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
