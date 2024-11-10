// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PageTitleTabsProps } from '../PageTitleTabs/types';

export type PageTitleProps = PageTitleTabsProps & {
  // tab button class.
  tabClassName?: string;
  // whether tabs are inline.
  inline?: boolean;
  // title of the page.
  title?: string;
  // a button right next to the page title.
  button?: {
    // title of the button.
    title: string;
    // function of the button when it is clicked.
    onClick: () => void;
  };
};
