// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export interface PageTitleTabsProps {
  // whether the title stick on the same position.
  sticky?: boolean;
  // an array of tab pages.
  tabs?: PageTitleTabProps[];
}

export interface PageTitleTabProps {
  // whether the title stick on the same position.
  sticky?: boolean;
  // title of the tab button.
  title: string;
  // whether it is clicked.
  active: boolean;
  // it leads to the corresponding tab page.
  onClick: () => void;
  // a badge that can have a glance at before visting the tab page.
  badge?: string | number;
  // whether the tab button is disabled.
  disabled?: boolean;
}
