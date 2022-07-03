// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { MessagesContextInterface } from '.';

export const defaultMessagesContext: MessagesContextInterface = {
  messages: [],
  // eslint-disable-next-line
  setMessage: (k: string, m: any) => {},
  // eslint-disable-next-line
  removeMessage: (k: string) => {},
  // eslint-disable-next-line
  setMessages: (msgs: any) => {},
  // eslint-disable-next-line
  getMessage: (k: string) => {},
};
