// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

export interface NotificationsContextInterface {
  addNotification: (n: NotificationItem) => void;
  notifySuccess: (msg: string) => void;
  notifyError: (msg: string) => void;
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
