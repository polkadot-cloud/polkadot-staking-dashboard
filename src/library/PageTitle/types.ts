// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

export interface PageTitleProps {
  title: string;
  tabs?: Array<any>;
  button?: {
    title: string;
    onClick: () => void;
  };
}
