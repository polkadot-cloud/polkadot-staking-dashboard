// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { PAGES_CONFIG } from './config/pages';

export const clipAddress = (val: string) => {
  return `${val.substring(0, 6)}...${val.substring(
    val.length - 6,
    val.length
  )}`;
};

export const convertRemToPixels = (rem: string) => {
  const remAsNumber = Number(rem.slice(0, rem.length - 3));
  return (
    remAsNumber *
    parseFloat(getComputedStyle(document.documentElement).fontSize)
  );
};

export const toFixedIfNecessary = (value: number, dp: number) => {
  return +parseFloat(String(value)).toFixed(dp);
};

export const planckToUnit = (val: number, units: number): number => {
  const value = val / 10 ** units;
  return value;
};

export const planckBnToUnit = (val: BN, units: number): number => {
  const value = val.toNumber() / 10 ** units;
  return value;
};

export const humanNumber = (val: number): string => {
  const str = val.toString().split('.');
  str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return str.join('.');
};

export const rmCommas = (val: string): string => {
  return val.replace(/,/g, '');
};

export const sleep = (milliseconds: number) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

export const removePercentage = (v: string) => {
  return Number(v.slice(0, -1));
};

export const shuffle = <T>(array: Array<T>) => {
  let currentIndex = array.length;
  let randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
};

export const pageFromUri = (pathname: string) => {
  const lastUriItem = pathname.substring(pathname.lastIndexOf('/') + 1);
  const page = lastUriItem.trim() === '' ? 'overview' : lastUriItem;
  return page;
};

export const isNumeric = (str: string | number) => {
  return !Number.isNaN(str) && !Number.isNaN(parseFloat(String(str)));
};

export const defaultIfNaN = <T>(val: T, _default: T) => {
  if (Number.isNaN(val)) {
    return _default;
  }
  return val;
};

export const localStorageOrDefault = <T>(
  key: string,
  _default: T,
  parse = false
) => {
  let val: string | null = localStorage.getItem(key);

  if (val === null) {
    return _default;
  }
  if (parse) {
    val = JSON.parse(val);
  }
  return val;
};

export const pageTitleFromUri = (pathname: string) => {
  for (const page of PAGES_CONFIG) {
    if (page.uri === pathname) return page.title;
  }
  return '';
};
