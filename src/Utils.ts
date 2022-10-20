// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { decodeAddress, encodeAddress } from '@polkadot/keyring';
import { hexToU8a, isHex, u8aToString, u8aUnwrapBytes } from '@polkadot/util';
import BN from 'bn.js';
import { MutableRefObject } from 'react';
import { AnyApi, AnyMetaBatch, PagesConfig } from 'types/index';

export const clipAddress = (val: string) => {
  if (typeof val !== 'string') {
    return val;
  }
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

/**
 * Converts an on chain balance value in BN planck to a decimal value in token unit (1 token token = 10^units planck)
 * @param val A BN that includes the balance in planck as it is stored on chain. It can be a very large number.
 * @param units the chain decimal points, that is used to calculate the balance denominator for the chain (e.g. 10 for polkadot, 12 for Kusama)
 * @returns A number that contains the equivalent value of the balance val in chain token unit. (e.g. DOT for polkadot, KSM for Kusama)
 */
export const planckBnToUnit = (val: BN, units: number): number => {
  // BN only supports integers.
  // We need to calculate the whole section and the decimal section separately and calculate the final representation by concatenating the two sections as string.
  const Bn10 = new BN(10);
  const BnUnits = new BN(units);
  const div = val.div(Bn10.pow(BnUnits));
  const mod = val.mod(Bn10.pow(BnUnits));

  // The whole portion in string
  const whole = div.toString();

  // The decimal fraction portion in string.
  // it is padded by '0's to achieve `units` number of decimal points.
  const decimal = mod.toString().padStart(units, '0');
  // the final number in string
  const result = `${whole}.${decimal || '0'}`;

  return Number(result);
};

/**
 * Converts a balance in token unit to an equivalent value in planck by applying the chain decimals point. (1 token = 10^units planck)
 * Since the result can be a very large number all calculations should happen in BN.
 * @param val the value in chain unit
 * @param units the chain decimal points (e.x. 10 for polkadot and 12 for Kusama)
 * @returns A big number that contains the equivalent value of the balance val in plancks
 */
export const unitToPlanckBn = (val: number, units: number): BN => {
  // convert to number in case the number arguments are passed as numeric strings
  val = Number(val);
  units = Number(units);

  // since the result can be a very large number we need to calculate the value in BN.
  const Bn10 = new BN(10);
  const BnUnits = new BN(units);

  // BN does not support decimal numbers.
  // 1. Convert the number to a fixed point decimal with the number of decimal points equal to the specified value for the chain (units)
  // 2. Split the number to separate whole portion and decimal fraction and store them as different BN values.
  const [w, d] = val.toFixed(units).split('.');
  const wholeBn = new BN(Number(w));
  const decimalBn = new BN(Number(d));

  // calculate the final result in planck by applying the decimal denominator(BnUnits)
  const resultBn = wholeBn.mul(Bn10.pow(BnUnits)).add(decimalBn);
  return resultBn;
};

export const humanNumberBn = (valBn: BN, units: number): string => {
  const val = planckBnToUnit(valBn, units);
  return humanNumber(val);
};

export const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

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
): T | string => {
  const val: string | null = localStorage.getItem(key);

  if (val === null) {
    return _default;
  }

  if (parse) {
    return JSON.parse(val) as T;
  }
  return val;
};

export const isValidAddress = (address: string) => {
  try {
    encodeAddress(isHex(address) ? hexToU8a(address) : decodeAddress(address));
    return true;
  } catch (error) {
    return false;
  }
};

export const escapeRegExp = (string: string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& === the whole matched string
};

// replace all to work with legacy browsers
export const replaceAll = (str: string, find: string, replace: string) => {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
};

export const determinePoolDisplay = (
  adddress: string,
  batchItem: AnyMetaBatch
) => {
  // default display value
  const defaultDisplay = clipAddress(adddress);

  // fallback to address on empty metadata string
  let display = batchItem ?? defaultDisplay;

  // check if super identity has been byte encoded
  const displayAsBytes = u8aToString(u8aUnwrapBytes(display));
  if (displayAsBytes !== '') {
    display = displayAsBytes;
  }
  // if still empty string, default to clipped address
  if (display === '') {
    display = defaultDisplay;
  }

  return display;
};

// extracts a URL value from a URL string
export const extractUrlValue = (key: string, url: string) => {
  if (typeof url === 'undefined') url = window.location.href;
  const match = url.match(`[?&]${key}=([^&]+)`);
  return match ? match[1] : null;
};

export const registerSaEvent = (e: string, a: AnyApi = {}) => {
  if ((window as AnyApi).sa_event) {
    (window as AnyApi).sa_event(e, a);
  }
};
