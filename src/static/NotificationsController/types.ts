// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export interface NotificationInterface {
  index: number;
  item: NotificationItem;
}

export interface NotificationItem extends NotificationText {
  index: number;
}

export interface NotificationText {
  title: string;
  subtitle: string;
}

export interface NotificationEventAddDetail {
  task: 'add';
  index: number;
  title: string;
  subtitle: string;
}

export interface NotificationEventDismissDetail {
  task: 'dismiss';
  index: number;
}
