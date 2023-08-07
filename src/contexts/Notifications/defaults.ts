// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { NotificationsContextInterface } from './types';

export const defaultNotificationsContext: NotificationsContextInterface = {
  // eslint-disable-next-line
  addNotification: (n) => {},
  // eslint-disable-next-line
  removeNotification: (n) => {},
  notifications: [],
};
