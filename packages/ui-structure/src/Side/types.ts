// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBase } from '@w3ux/types';

export type SideProps = ComponentBase & {
  // Whether the side menu should be open on smaller screens.
  open: boolean;
  // Whether side menu is in minimised state.
  minimised: boolean;
  // Optional width property to be applied to maximised side.
  width?: string | number;
};
