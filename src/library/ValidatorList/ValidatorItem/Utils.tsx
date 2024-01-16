// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { u8aToString, u8aUnwrapBytes } from '@polkadot/util';
import type BigNumber from 'bignumber.js';
import { MaxEraRewardPointsEras } from 'consts';
import type { AnyJson } from 'types';

export const getIdentityDisplay = (
  _identity: AnyJson,
  _superIdentity: AnyJson
) => {
  let displayFinal = '';
  let foundSuper = false;

  // check super identity exists, get display.Raw if it does
  const superIdentity = _superIdentity?.identity ?? null;
  const superRaw = _superIdentity?.superOf?.[1]?.Raw ?? null;

  const superDisplay = superIdentity?.info?.display?.Raw ?? null;

  // check if super raw has been encoded
  const superRawAsBytes = u8aToString(u8aUnwrapBytes(superRaw));

  // check if super identity has been byte encoded
  const superIdentityAsBytes = u8aToString(u8aUnwrapBytes(superDisplay));

  if (superIdentityAsBytes !== '') {
    displayFinal = superIdentityAsBytes;
    foundSuper = true;
  } else if (superDisplay !== null) {
    displayFinal = superDisplay;
    foundSuper = true;
  }

  if (!foundSuper) {
    // cehck sub identity exists, get display.Raw if it does
    const identity = _identity?.info?.display?.Raw ?? null;

    // check if identity has been byte encoded
    const subIdentityAsBytes = u8aToString(u8aUnwrapBytes(identity));

    if (subIdentityAsBytes !== '') {
      displayFinal = subIdentityAsBytes;
    } else if (identity !== null) {
      displayFinal = identity;
    }
  }
  if (displayFinal === '') {
    return null;
  }

  return (
    <>
      {displayFinal}
      {superRawAsBytes !== '' ? (
        <span>/ {superRawAsBytes}</span>
      ) : superRaw !== null ? (
        <span>/ {superRaw}</span>
      ) : null}
    </>
  );
};

// Normalise era points between 0 and 1 relative to the highest recorded value.
export const normaliseEraPoints = (
  eraPoints: Record<string, BigNumber>,
  high: BigNumber
): Record<string, number> => {
  const percentile = high.dividedBy(100);

  return Object.fromEntries(
    Object.entries(eraPoints).map(([era, points]) => [
      era,
      points.dividedBy(percentile).multipliedBy(0.01).toNumber(),
    ])
  );
};

// Prefill low values where no points are recorded.
export const prefillEraPoints = (eraPoints: number[]): number[] => {
  const missing = Math.max(MaxEraRewardPointsEras - eraPoints.length, 0);

  if (!missing) {
    return eraPoints;
  }

  return Array(missing).fill(0).concat(eraPoints);
};
