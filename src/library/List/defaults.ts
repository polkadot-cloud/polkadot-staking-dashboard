// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

export const defaultContext = {
  setSelectable: (_selectable: boolean) => {},
  addToSelected: (item: any) => {},
  removeFromSelected: (items: any[]) => {},
  resetSelected: () => {},
  setListFormat: (v: string) => {},
  selected: [],
  selectable: false,
  listFormat: 'col',
  selectToggleable: true,
};
