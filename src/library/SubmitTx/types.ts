// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type React from 'react';

export type SubmitTxProps = SubmitProps & {
  buttons?: Array<React.ReactNode>;
  fromController?: boolean;
  noMargin?: boolean;
};

export interface SubmitProps {
  onSubmit: (customEvent?: string) => void;
  submitting: boolean;
  valid: boolean;
  submitText?: string;
  customEvent?: string;
}
