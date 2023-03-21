// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type React from 'react';
import type { AnyJson } from 'types';

export type SubmitTxProps = SubmitProps & {
  buttons?: Array<React.ReactNode>;
  fromController?: boolean;
  noMargin?: boolean;
};

export interface SubmitProps {
  getPayload?: () => AnyJson;
  onSubmit: () => void;
  submitting: boolean;
  valid: boolean;
  submitText?: string;
}
