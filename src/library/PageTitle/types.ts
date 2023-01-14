// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

export interface PageTitleProps {
  title: string;
  tabs?: Array<any>;
  button?: {
    title: string;
    onClick: () => void;
  };
}
