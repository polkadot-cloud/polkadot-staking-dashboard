// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { u8aToString, u8aUnwrapBytes } from '@polkadot/util';

export const getIdentityDisplay = (_identity: any, _superIdentity: any) => {
  let displayFinal = '';
  let foundSuper = false;

  // check super identity exists, get display.Raw if it does
  const superIdentity = _superIdentity?.identity ?? null;
  const superRaw = _superIdentity?.[1]?.Raw ?? null;
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
