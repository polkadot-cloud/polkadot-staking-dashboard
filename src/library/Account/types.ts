// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

export interface AccountProps {
  onClick?: () => void;
  value: string;
  format: string;
  label?: string;
  canClick: boolean;
  filled: boolean;
  fontSize?: string;
  title?: string;
  readOnly?: boolean;
}
