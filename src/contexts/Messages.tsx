// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useEffect } from 'react';
import { useConnect } from './Connect'

export interface MessagesContextState {
  messages: any;
}

export const MessagesContext: React.Context<MessagesContextState> = React.createContext({
  messages: [],
});

export const useMessages = () => React.useContext(MessagesContext);

export const MessagesContextWrapper = (props: any) => {

  const { activeAccount, status: connectStatus }: any = useConnect();


  useEffect(() => {
    // console.log('re-configure messages');
  }, [activeAccount, connectStatus])

  const [state, setState]: any = useState({
    mesages: [],
  });

  // TODO: check if controller exists for account, store in messages if does not.

  return (
    <MessagesContext.Provider value={{
      messages: state.messages,
    }}>
      {props.children}
    </MessagesContext.Provider>
  );
}