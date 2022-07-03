// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

export interface NotificationsContextInterface {
  addNotification: (n: NotificationItem) => void;
  removeNotification: (i: number) => void;
  notifications: NotificationInterface[];
}

export interface NotificationInterface {
  index: number;
  item: NotificationItem;
}

export interface NotificationItem extends NotificationText {
  index?: number;
}

export interface NotificationText {
  title: string;
  subtitle: string;
}
