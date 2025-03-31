// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBase } from 'types'

export type SideProps = ComponentBase & {
  // Whether the side menu should be open on smaller screens.
  open: boolean
  // Whether side menu is in minimised state.
  minimised: boolean
}
