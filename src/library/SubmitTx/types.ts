// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type React from 'react';
import type { MaybeAccount } from 'types';

export type SubmitTxProps = SubmitProps & {
  buttons?: React.ReactNode[];
  fromController?: boolean;
  proxySupported: boolean;
  submitAddress?: MaybeAccount;
  noMargin?: boolean;
};

export interface SubmitProps {
  uid?: number;
  onSubmit: (customEvent?: string) => void;
  submitting: boolean;
  valid: boolean;
  submitText?: string;
  customEvent?: string;
  submitAddress: MaybeAccount;
}

export interface SignerPromptProps {
  submitAddress: MaybeAccount;
}
