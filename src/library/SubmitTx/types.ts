// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { IconProp } from '@fortawesome/fontawesome-svg-core';
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
  onSubmit: (customEvent?: string) => void;
  submitting: boolean;
  valid: boolean;
  submitText?: string;
  customEvent?: string;
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

export interface ButtonSubmitLargeProps {
  disabled: boolean;
  onSubmit: () => void;
  submitText: string;
  icon?: IconProp;
  iconTransform?: string;
  pulse: boolean;
}
