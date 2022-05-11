// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

export const getIdentityDisplay = (identity: any, _superIdentity: any) => {

  // first check identity of validator

  // display.Raw
  let display = identity?.info?.display?.Raw ?? null;
  // legal.Raw
  display = display === null ? identity?.info?.legal.Raw ?? null : display;

  if (display !== null) {
    return display;
  }

  // if still null, check super identity

  let superIdentity = _superIdentity?.identity ?? null;

  display = superIdentity?.info?.display?.Raw ?? null;
  // legal.Raw
  display = display === null ? superIdentity?.info?.legal.Raw ?? null : display;

  return display;
}