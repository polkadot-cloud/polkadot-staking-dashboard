// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

export interface NotificationsContextInterface {
  addNotification: (n: any) => any;
  removeNotification: (n: any) => void;
  notifications: any;
}
