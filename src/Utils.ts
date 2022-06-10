// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { MutableRefObject } from 'react';
import { PagesConfig } from 'types/index';

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
  const Bn10 = new BN(10);
  const BnUnits = new BN(units);
  const div = val.div(Bn10.pow(BnUnits));
  const mod = val.mod(Bn10.pow(BnUnits));
  const whole = div.toString();
  const decimal = mod.toString().padStart(units, '0');
  const result = `${whole}.${decimal || '0'}`;
  return Number(result);
};

export const unitToPlanckBn = (val: number, units: number): BN => {
  // convert to number in case the number arguments are passed as numeric strings
  val = Number(val);
  units = Number(units);

  const Bn10 = new BN(10);
  const BnUnits = new BN(units);
  const [w, d] = val.toFixed(units).split('.');
  const wholeBn = new BN(Number(w));
  const decimalBn = new BN(Number(d));
  const resultBn = wholeBn.mul(Bn10.pow(BnUnits)).add(decimalBn);
  return resultBn;
};

export const humanNumberBn = (valBn: BN, units: number): string => {
  const val = planckBnToUnit(valBn, units);
  return humanNumber(val);
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

export const pageTitleFromUri = (pathname: string, pages: PagesConfig) => {
  for (const page of pages) {
    if (page.uri === pathname) return page.title;
  }
  return '';
};

export const isNumeric = (str: string | number) => {
  str = typeof str === 'string' ? str.trim() : String(str);
  return str !== '' && !Number.isNaN(Number(str));
};

export const defaultIfNaN = <T>(val: T, _default: T) => {
  if (Number.isNaN(val)) {
    return _default;
  }
  return val;
};

export const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const setStateWithRef = <T>(
  value: T,
  setState: (_state: T) => void,
  ref: MutableRefObject<T>
): void => {
  setState(value);
  ref.current = value;
};

export const localStorageOrDefault = <T>(
  key: string,
  _default: T,
  parse = false
) => {
  const val: string | null = localStorage.getItem(key);

  if (val === null) {
    return _default;
  }

  if (parse) {
    return JSON.parse(val) as T;
  }
  return val as string;
};
