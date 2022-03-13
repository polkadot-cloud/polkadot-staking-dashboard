// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useEffect } from 'react';
import { useConnect } from './Connect'
import { useBalances } from './Balances';
import { GLOBAL_MESSGE_KEYS } from '../constants';

export interface MessagesContextState {
  messages: any;
  setMessage: (k: string, m: any) => void;
  setMessages: (msgs: any) => void;
  removeMessage: (k: string) => void;
  getMessage: (k: string) => any;
}

export const MessagesContext: React.Context<MessagesContextState> = React.createContext({
  messages: [],
  setMessage: (k: string, m: any) => { },
  removeMessage: (k: string) => { },
  setMessages: (msgs: any) => { },
  getMessage: (k: string) => { },
});

export const useMessages = () => React.useContext(MessagesContext);

export const MessagesContextWrapper = (props: any) => {

  const { activeAccount, status: connectStatus, accountExists }: any = useConnect();
  const { accounts: balanceAccounts, getBondedAccount }: any = useBalances();

  const [state, setState]: any = useState({
    messages: [],
  });

  useEffect(() => {
    let messages = [];

    // is controller missing from imported accounts? (check once balanceAccounts are fetched)
    if (balanceAccounts.length) {
      let controller = getBondedAccount(activeAccount);
      if (controller !== null) {
        if (!accountExists(controller)) {
          messages.push({
            key: GLOBAL_MESSGE_KEYS.CONTROLLER_NOT_IMPORTED,
            msg: true
          });
        }
      }
    }
    setMessages(messages);

  }, [activeAccount, connectStatus, getBondedAccount(activeAccount), balanceAccounts.length])


  const setMessage = (key: string, msg: any) => {
    let filtered = state.messages.filter((message: any) => message.key !== key);
    filtered.push({
      key: key,
      msg: msg
    });
    setState({
      messages: filtered
    });
  }

  const setMessages = (msgs: any) => {
    let _messages = state.messages;
    let filtered: any = [];
    for (let i = 0; i < msgs.length; i++) {

      filtered = _messages = Object.values(_messages.filter((msg: any) => msgs[i].key !== msg.key));

      filtered.push({
        key: msgs[i].key,
        msg: msgs[i].msg,
      });
    }

    setState({
      messages: filtered,
    });
  }

  const removeMessage = (key: string) => {
    const _messages = state.messages.filter((message: any) => message.key !== key);
    setState({ messages: _messages });
  }

  const getMessage = (key: string) => {
    const _message = state.messages.filter((message: any) => message.key === key);
    return _message.length === 0 ? null : _message[0].msg;
  }

  return (
    <MessagesContext.Provider value={{
      messages: state.messages,
      setMessage: setMessage,
      setMessages: setMessages,
      removeMessage: removeMessage,
      getMessage: getMessage,
    }}>
      {props.children}
    </MessagesContext.Provider>
  );
}