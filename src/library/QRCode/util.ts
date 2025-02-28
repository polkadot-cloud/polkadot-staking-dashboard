// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { isString, u8aConcat, u8aToU8a } from '@polkadot/util';
import { decodeAddress } from '@polkadot/util-crypto';
import { CRYPTO_SR25519, FRAME_SIZE, SUBSTRATE_ID } from './constants.js';

const MULTIPART = new Uint8Array([0]);

export const encodeNumber = (value: number): Uint8Array =>
  // eslint-disable-next-line no-bitwise
  new Uint8Array([value >> 8, value & 0xff]);

export const encodeString = (value: string): Uint8Array => {
  const count = value.length;
  const u8a = new Uint8Array(count);

  for (let i = 0; i < count; i++) {
    u8a[i] = value.charCodeAt(i);
  }

  return u8a;
};

export const createSignPayload = (
  address: string,
  cmd: number,
  payload: string | Uint8Array,
  genesisHash: string | Uint8Array
): Uint8Array =>
  u8aConcat(
    SUBSTRATE_ID,
    CRYPTO_SR25519,
    new Uint8Array([cmd]),
    decodeAddress(address),
    u8aToU8a(payload),
    u8aToU8a(genesisHash)
  );

export const createFrames = (input: Uint8Array): Uint8Array[] => {
  const frames = [];
  let idx = 0;

  while (idx < input.length) {
    frames.push(input.subarray(idx, idx + FRAME_SIZE));

    idx += FRAME_SIZE;
  }

  return frames.map(
    (frame, index: number): Uint8Array =>
      u8aConcat(
        MULTIPART,
        encodeNumber(frames.length),
        encodeNumber(index),
        frame
      )
  );
};

export const createImgSize = (
  size?: string | number
): Record<string, string> => {
  if (!size) {
    return {
      height: 'auto',
      width: '100%',
    };
  }

  const width = isString(size) ? size : `${size}px`;

  return {
    width,
    height: 'auto',
  };
};
