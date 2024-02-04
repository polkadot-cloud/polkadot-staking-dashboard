// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { SyncEvent, SyncStatus } from './types';

export class SyncController {
  // ------------------------------------------------------
  // Dispatch sync events
  // ------------------------------------------------------

  // Dispatches a new sync event to the document.
  static dispatch = (id: string, status: SyncStatus) => {
    const detail: SyncEvent = {
      id,
      status,
    };
    document.dispatchEvent(
      new CustomEvent('new-sync-status', {
        detail,
      })
    );
  };

  // Checks if event detailis a valid `new-sync-status` event.
  static isValidSyncStatus = (
    event: CustomEvent
  ): event is CustomEvent<SyncEvent> =>
    event.detail && event.detail.id && event.detail.status;
}
