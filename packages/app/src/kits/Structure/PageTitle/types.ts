// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PageTitleTabsProps } from '../PageTitleTabs/types';

export type PageTitleProps = PageTitleTabsProps & {
  colorSecondary?: boolean;
  tabClassName?: string;
  inline?: boolean;
  title?: string;
  button?: {
    title: string;
    onClick: () => void;
  };
};
