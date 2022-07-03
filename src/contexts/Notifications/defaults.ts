// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { NotificationsContextInterface } from '.';

export const defaultNotificationsContext: NotificationsContextInterface = {
  // eslint-disable-next-line
  addNotification: (n: any) => {},
  // eslint-disable-next-line
    removeNotification: (n: any) => {},
  notifications: [],
};
