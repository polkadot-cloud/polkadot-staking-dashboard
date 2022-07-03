// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import { defaultMessagesContext } from './defaults';

export interface MessagesContextInterface {
  messages: any;
  setMessage: (k: string, m: any) => void;
  setMessages: (msgs: any) => void;
  removeMessage: (k: string) => void;
  getMessage: (k: string) => any;
}

export const MessagesContext = React.createContext<MessagesContextInterface>(
  defaultMessagesContext
);

export const useMessages = () => React.useContext(MessagesContext);

export const MessagesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [messages, _setMessages]: any = useState([]);

  const setMessage = (key: string, msg: any) => {
    const filtered = messages.filter((message: any) => message.key !== key);
    filtered.push({
      key,
      msg,
    });
    _setMessages(filtered);
  };

  const setMessages = (msgs: any) => {
    const _messages = messages;
    let filtered: any = [];
    for (let i = 0; i < msgs.length; i++) {
      filtered = Object.values(
        _messages.filter((msg: any) => msgs[i].key !== msg.key)
      );

      filtered.push({
        key: msgs[i].key,
        msg: msgs[i].msg,
      });
    }
    _setMessages(filtered);
  };

  const removeMessage = (key: string) => {
    const _messages = messages.filter((message: any) => message.key !== key);
    _setMessages(_messages);
  };

  const getMessage = (key: string) => {
    const _message = messages.filter((message: any) => message.key === key);
    return _message.length === 0 ? null : _message[0].msg;
  };

  return (
    <MessagesContext.Provider
      value={{
        messages,
        setMessage,
        setMessages,
        removeMessage,
        getMessage,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
};
