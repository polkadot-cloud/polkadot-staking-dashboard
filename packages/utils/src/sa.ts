// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { getUnixTime } from 'date-fns'

export const registerLastVisited = (utmSource: string | null) => {
  const attributes = utmSource ? { utmSource } : {}

  if (!localStorage.getItem('last_visited')) {
    registerSaEvent('new_user', attributes)
  } else {
    registerSaEvent('returning_user', attributes)
  }
  localStorage.setItem('last_visited', String(getUnixTime(Date.now())))
}

export const registerSaEvent = (e: string, a: unknown = {}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any
  if (w.sa_event) {
    w.sa_event(e, a)
  }
}
