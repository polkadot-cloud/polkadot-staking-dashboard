// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import type { DisplayFor, MaybeAddress } from 'types';

export type SubmitTxProps = SubmitProps & {
  buttons?: ReactNode[];
  fromController?: boolean;
  proxySupported: boolean;
  submitAddress?: MaybeAddress;
  noMargin?: boolean;
};

export interface SubmitProps {
  uid?: number;
  onSubmit: () => void;
  submitting: boolean;
  valid: boolean;
  submitText?: string;
  submitAddress: MaybeAddress;
  displayFor?: DisplayFor;
}

export interface SignerPromptProps {
  submitAddress: MaybeAddress;
}

export interface LedgerSubmitProps {
  onSubmit: () => void;
  submitting: boolean;
  displayFor?: DisplayFor;
  disabled: boolean;
  submitText?: string;
}
