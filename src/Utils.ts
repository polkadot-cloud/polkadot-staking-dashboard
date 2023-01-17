// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { decodeAddress, encodeAddress } from '@polkadot/keyring';
import { hexToU8a, isHex, u8aToString, u8aUnwrapBytes } from '@polkadot/util';
import BigNumber from 'bignumber.js';
import { MutableRefObject } from 'react';
import { AnyMetaBatch } from 'types/index';

export const clipAddress = (val: string) => {
  if (typeof val !== 'string') {
    return val;
  }
  return `${val.substring(0, 6)}...${val.substring(
    val.length - 6,
    val.length
  )}`;
};

export const remToUnit = (rem: string) =>
  Number(rem.slice(0, rem.length - 3)) *
  parseFloat(getComputedStyle(document.documentElement).fontSize);

export const toFixedIfNecessary = (value: number, dp: number) =>
  +parseFloat(String(value)).toFixed(dp);

/**
 * Converts an on chain balance value in BigNumber planck to a decimal value in token unit (1 token
 * token = 10^units planck).
 */
export const planckToUnit = (val: BigNumber, units: number): number =>
  Number(
    val
      .dividedBy(new BigNumber(10).exponentiatedBy(new BigNumber(units)))
      .toFixed(units + 1, BigNumber.ROUND_FLOOR)
  );

/**
 * Converts a balance in token unit to an equivalent value in planck by applying the chain decimals
 * point. (1 token = 10^units planck).
 */
export const unitToPlanck = (val: string, units: number): BigNumber =>
  new BigNumber(val ?? 0)
    .multipliedBy(new BigNumber(10).exponentiatedBy(new BigNumber(units)))
    .integerValue();

export const humanNumber = (val: number | string | BigNumber): string => {
  const str = val.toString().split('.');
  str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return str.join('.');
};

export const rmCommas = (val: string): string => val.replace(/,/g, '');

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

export const capitalizeFirstLetter = (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

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
  } catch (e) {
    return false;
  }
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
export const extractUrlValue = (key: string, url?: string) => {
  if (typeof url === 'undefined') url = window.location.href;
  const match = url.match(`[?&]${key}=([^&]+)`);
  return match ? match[1] : null;
};

// converts a string of text to camelCase
export const camelize = (str: string) =>
  str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
      index === 0 ? word.toLowerCase() : word.toUpperCase()
    )
    .replace(/\s+/g, '');

// Puts a variable into the URL hash as a param.
//
// Since url variables are added to the hash and are not treated as URL params, the params are split
// and parsed into a `URLSearchParams`.
export const varToUrlHash = (
  key: string,
  val: string,
  addIfMissing: boolean
) => {
  const hash = window.location.hash;
  const [page, params] = hash.split('?');
  const searchParams = new URLSearchParams(params);

  if (searchParams.get(key) === null && !addIfMissing) {
    return;
  }
  searchParams.set(key, val);
  window.location.hash = `${page}?${searchParams.toString()}`;
};

// Removes a variable `key` from the URL hash if it exists.
//
// Removes dangling `?` if no URL variables exist.
export const removeVarFromUrlHash = (key: string) => {
  const hash = window.location.hash;
  const [page, params] = hash.split('?');
  const searchParams = new URLSearchParams(params);
  if (searchParams.get(key) === null) {
    return;
  }
  searchParams.delete(key);
  const paramsAsStr = searchParams.toString();
  window.location.hash = `${page}${paramsAsStr ? `?${paramsAsStr}` : ``}`;
};
