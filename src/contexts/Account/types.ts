// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors

export type Address = string | undefined;
export type AccountRole = string | undefined;

export interface AccountContextInterface {
  address: Address;
  role: AccountRole;
}
