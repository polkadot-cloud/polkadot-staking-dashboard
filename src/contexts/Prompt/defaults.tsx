// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PromptContextInterface } from './types';

export const defaultPromptContext: PromptContextInterface = {
  // eslint-disable-next-line
  openPromptWith: (o, s) => {},
  closePrompt: () => {},
  // eslint-disable-next-line
  setStatus: (s) => {},
  // eslint-disable-next-line
  setPrompt: (d) => {},
  size: 'small',
  status: 0,
  Prompt: null,
};
