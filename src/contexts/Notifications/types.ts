// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type {
  NotificationInterface,
  NotificationItem,
} from 'static/Notifications/types';

export interface NotificationsContextInterface {
  addNotification: (n: NotificationItem) => void;
  removeNotification: (i: number) => void;
  notifications: NotificationInterface[];
}
