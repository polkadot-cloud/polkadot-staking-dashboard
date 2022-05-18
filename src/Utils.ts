// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';

export const clipAddress = (val: string) => {
  return `${val.substring(0, 6)}...${val.substring(val.length - 6, val.length)}`;
};

export const convertRemToPixels = (rem: any) => {
  const remAsNumber = (rem.substr(0, rem.length - 3));
  return remAsNumber * parseFloat(getComputedStyle(document.documentElement).fontSize);
};

export const toFixedIfNecessary = (value: any, dp: any) => {
  return +parseFloat(value).toFixed(dp);
};

export const planckToUnit: any = (val: any, units: number) => {
  const value = val / (10 ** units);
  return value;
};

export const planckBnToUnit: any = (val: BN, units: number) => {
  const value = val.toNumber() / (10 ** units);
  return value;
};

export const fiatAmount: any = (val: any) => {
  return val.toFixed(2);
};

export const humanNumber: any = (val: any) => {
  const str = val.toString().split('.');
  str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return str.join('.');
};

export const rmCommas: any = (val: any) => {
  return val.replace(/,/g, '');
};

export const sleep = (milliseconds: number) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

export const removePercentage = (v: string) => {
  return Number(v.slice(0, -1));
};

export const shuffle = (array: any) => {
  let currentIndex = array.length; let
    randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
};

export const pageFromUri = (pathname: string) => {
  const lastUriItem = pathname.substring(pathname.lastIndexOf('/') + 1);
  const page = lastUriItem.trim() === '' ? 'overview' : lastUriItem;
  return page;
};

export const isNumeric = (str: any) => {
  return !Number.isNaN(str) && !Number.isNaN(parseFloat(str));
};

export const defaultIfNaN = (val: any, _default: any) => {
  if (Number.isNaN(val)) {
    return _default;
  }
  return val;
};

export const localStorageOrDefault = (key: string, _default: any, parse = false) => {
  let val: any = localStorage.getItem(key);

  if (val === null) {
    val = _default;
  } else if (parse) {
    val = JSON.parse(val);
  }
  return val;
};
