// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

export interface MessagesContextState {
  messages: any;
}

export const MessagesContext: React.Context<MessagesContextState> = React.createContext({
  messages: [],
});

export const useMessages = () => React.useContext(MessagesContext);

export const MessagesContextWrapper = (props: any) => {

  const [state, setState]: any = useState({
    mesages: [],
  });

  return (
    <MessagesContext.Provider value={{
      messages: state.messages,
    }}>
      {props.children}
    </MessagesContext.Provider>
  );
}