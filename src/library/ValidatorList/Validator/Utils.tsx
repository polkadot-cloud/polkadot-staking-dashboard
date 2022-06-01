// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { u8aToString, u8aUnwrapBytes } from '@polkadot/util';

export const getIdentityDisplay = (identity: any, _superIdentity: any) => {
  // first check identity of validator

  // display.Raw
  let display = identity?.info?.display?.Raw ?? null;
  // legal.Raw
  display = display === null ? identity?.info?.legal.Raw ?? null : display;

  // check if identity has been byte encoded
  const displayAsBytes = u8aToString(u8aUnwrapBytes(display));

  if (displayAsBytes !== '') {
    return displayAsBytes;
  }
  if (display !== null) {
    return display;
  }

  // if still null, check super identity
  const superIdentity = _superIdentity?.identity ?? null;

  // display.Raw
  display = superIdentity?.info?.display?.Raw ?? null;
  // legal.Raw
  display = display === null ? superIdentity?.info?.legal.Raw ?? null : display;

  // check if super identity has been byte encoded
  const superIdentityAsBytes = u8aToString(u8aUnwrapBytes(display));

  if (superIdentityAsBytes !== '') {
    return superIdentityAsBytes;
  }
  if (display !== null) {
    return display;
  }

  return display;
};
