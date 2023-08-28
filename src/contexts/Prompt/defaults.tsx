// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

import type { PromptContextInterface } from './types';

export const defaultPromptContext: PromptContextInterface = {
  openPromptWith: (o, s) => {},
  closePrompt: () => {},
  setStatus: (s) => {},
  setPrompt: (d) => {},
  size: 'small',
  status: 0,
  Prompt: null,
};
