// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

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
