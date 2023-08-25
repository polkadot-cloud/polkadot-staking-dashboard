// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export interface AccountProps {
  onClick?: () => void;
  value: string;
  format: string;
  label?: string;
  canClick: boolean;
  fontSize?: string;
  title?: string;
  readOnly?: boolean;
  pool?: any;
}

export interface WrapperProps {
  $canClick: boolean;
  $fontSize: string;
}
