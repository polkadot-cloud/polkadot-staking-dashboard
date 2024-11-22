// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export interface VaultPromptHandlers {
  openPrompt: (
    onComplete: (status: 'complete' | 'cancelled', result: Uint8Array) => void,
    toSign: Uint8Array
  ) => void;
  closePrompt: () => void;
  setSubmitting: (submitting: boolean) => void;
}

export type VaultSignStatus = 'complete' | 'cancelled';
