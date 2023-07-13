// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Circle } from './types';

/*
  A generic identity icon, taken from
  https://github.com/polkadot-js/ui/tree/master/packages/react-identicon
*/

const S = 64;
const C = S / 2;
export const Z = (S / 64) * 5;

export const OUTER_CIRCLE: Circle = {
  cx: C,
  cy: C,
  fill: 'transparent',
  r: C,
};

export const renderCircle = ({ cx, cy, fill, r }: Circle, key: number) => {
  return <circle cx={cx} cy={cy} fill={fill} key={key} r={r} />;
};

const getRotation = (): {
  r: number;
  ro2: number;
  r3o4: number;
  ro4: number;
  rroot3o2: number;
  rroot3o4: number;
} => {
  const r = (C / 4) * 3;
  const rroot3o2 = (r * Math.sqrt(3)) / 2;
  const ro2 = r / 2;
  const rroot3o4 = (r * Math.sqrt(3)) / 4;
  const ro4 = r / 4;
  const r3o4 = (r * 3) / 4;

  return { r, r3o4, ro2, ro4, rroot3o2, rroot3o4 };
};

export const getCircleXY = (): [number, number][] => {
  const { r, r3o4, ro2, ro4, rroot3o2, rroot3o4 } = getRotation();

  return [
    [C, C - r],
    [C, C - ro2],
    [C - rroot3o4, C - r3o4],
    [C - rroot3o2, C - ro2],
    [C - rroot3o4, C - ro4],
    [C - rroot3o2, C],
    [C - rroot3o2, C + ro2],
    [C - rroot3o4, C + ro4],
    [C - rroot3o4, C + r3o4],
    [C, C + r],
    [C, C + ro2],
    [C + rroot3o4, C + r3o4],
    [C + rroot3o2, C + ro2],
    [C + rroot3o4, C + ro4],
    [C + rroot3o2, C],
    [C + rroot3o2, C - ro2],
    [C + rroot3o4, C - ro4],
    [C + rroot3o4, C - r3o4],
    [C, C],
  ];
};
