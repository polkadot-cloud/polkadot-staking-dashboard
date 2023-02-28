// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors

export interface RoleContextInterface {
  fetchAvailableReps: () => Promise<Array<string>>;
}
