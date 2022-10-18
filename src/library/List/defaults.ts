// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable @typescript-eslint/no-unused-vars */

export const defaultContext = {
  setSelectable: (_selectable: boolean) => {},
  addToSelected: (item: any) => {},
  removeFromSelected: (items: Array<any>) => {},
  resetSelected: () => {},
  setListFormat: (v: string) => {},
  selected: [],
  selectable: false,
  listFormat: 'col',
  selectToggleable: true,
};
