// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type React from 'react';

export interface SubmitTxProps {
  submit: () => void;
  submitting: boolean;
  valid: boolean;
  buttons?: Array<React.ReactNode>;
  fromController?: boolean;
  submitText?: string;
}
