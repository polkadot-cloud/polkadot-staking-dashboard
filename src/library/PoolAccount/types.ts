// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

export interface PoolAccountProps {
  label?: string;
  pool?: any;
  filled?: boolean;
  fontSize?: string;
  canClick: any;
  onClick?: () => void;
  value?: string;
  title?: string | undefined;
}

export interface WrapperProps {
  fill: string;
  fontSize: string;
  cursor: string;
}
