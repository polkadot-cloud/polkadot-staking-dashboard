// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from "bn.js";

export const clipAddress = (val: string) => {
  return val.substring(0, 6) + '...' + val.substring(val.length - 6, val.length);
}

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

export const sleep = (milliseconds: number) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

export const removePercentage = (v: string) => {
  return Number(v.slice(0, -1));
}

export const shuffle = (array: any) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}

export const pageFromUri = (pathname: string) => {
  const lastUriItem = pathname.substring(pathname.lastIndexOf('/') + 1);
  const page = lastUriItem.trim() === '' ? 'overview' : lastUriItem;
  return page;
}