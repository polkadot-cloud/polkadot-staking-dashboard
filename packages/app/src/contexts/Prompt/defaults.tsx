// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

import type { PromptContextInterface } from './types'

export const defaultPromptContext: PromptContextInterface = {
  setOnClosePrompt: (value) => {},
  openPromptWith: (o, s, c) => {},
  closePrompt: () => {},
  setStatus: (s) => {},
  setPrompt: (d) => {},
  closeOnOutsideClick: true,
  size: 'small',
  status: 0,
  Prompt: null,
  setCloseOnOutsideClick: (canClose) => {},
}
