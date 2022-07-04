// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

export interface SessionEraContextInterface {
  getEraTimeLeft: () => number;
  sessionEra: SessionEra;
}

export interface SessionEra {
  eraLength: number;
  eraProgress: number;
  sessionLength: number;
  sessionProgress: number;
  sessionsPerEra: number;
}
