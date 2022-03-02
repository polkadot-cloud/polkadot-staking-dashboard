// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from "bn.js";

export const numCommaFormatted = (x: BN | number) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
