// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { getUnixTime } from 'date-fns';
import type { AnyApi } from 'types/index';

export const registerLastVisited = (utmSource: string | null) => {
  const attributes = utmSource ? { utmSource } : {};

  if (!localStorage.getItem('last_visited')) {
    registerSaEvent('new_user', attributes);
  } else {
    registerSaEvent('returning_user', attributes);
  }
  localStorage.setItem('last_visited', String(getUnixTime(Date.now())));
};

export const registerSaEvent = (e: string, a: AnyApi = {}) => {
  if ((window as AnyApi).sa_event) {
    (window as AnyApi).sa_event(e, a);
  }
};
