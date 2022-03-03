// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from "bn.js";

export const numCommaFormatted = (x: BN | number) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const planckToDot: any = (val: any) => {
  return val / (10 ** 10);
}

export const fiatAmount: any = (val: any) => {
  return val.toFixed(2);
}

export const humanNumber: any = (val: any) => {

  var str = val.toString().split(".");
  str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return str.join(".");
}