// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { blake2AsU8a, decodeAddress } from '@polkadot/util-crypto';
import { SCHEMA, findScheme } from './scheme';

/*
  A generic identity icon, taken from
  https://github.com/polkadot-js/ui/tree/master/packages/react-identicon
*/

let zeroHash: Uint8Array = new Uint8Array();

const addressToId = (address: string): Uint8Array => {
  if (!zeroHash.length) {
    zeroHash = blake2AsU8a(new Uint8Array(32), 512);
  }

  return blake2AsU8a(decodeAddress(address), 512).map(
    (x: number, i: number) => (x + 256 - zeroHash[i]) % 256
  );
};

export const getColors = (address: string): string[] => {
  const total = Object.values(SCHEMA)
    .map((s): number => s.freq)
    .reduce((a, b): number => a + b);
  const id = addressToId(address);
  const d = Math.floor((id[30] + id[31] * 256) % total);
  const rot = (id[28] % 6) * 3;
  const sat = (Math.floor((id[29] * 70) / 256 + 26) % 80) + 30;
  const scheme = findScheme(d);
  const palette = Array.from(id).map((x, i): string => {
    const b = (x + (i % 28) * 58) % 256;

    if (b === 0) {
      return '#444';
    }
    if (b === 255) {
      return 'transparent';
    }

    const h = Math.floor(((b % 64) * 360) / 64);
    const l = [53, 15, 35, 75][Math.floor(b / 64)];

    return `hsl(${h}, ${sat}%, ${l}%)`;
  });

  return scheme.colors.map(
    (_, i) => palette[scheme.colors[i < 18 ? (i + rot) % 18 : 18]]
  );
};
