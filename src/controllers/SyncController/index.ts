// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { defaultSyncIds } from './defaults';
import type { SyncEvent, SyncID, SyncIDConfig, SyncStatus } from './types';

export class SyncController {
  // ------------------------------------------------------
  // Class members
  // ------------------------------------------------------

  // List of all syncIds currently syncing. NOTE: `initialization` is added by default as the
  // network always initializes from initial state.
  static syncIds: SyncID[] = defaultSyncIds;

  // ------------------------------------------------------
  // Dispatch sync events
  // ------------------------------------------------------

  // Dispatch all default syncId events as syncing.
  static dispatchAllDefault = () => {
    this.syncIds.forEach((id) => this.dispatch(id, 'syncing'));
  };

  // Dispatches a new sync event to the document.
  static dispatch = (id: SyncID, status: SyncStatus) => {
    const detail: SyncEvent = {
      id,
      status,
    };

    // Keep class syncIds up to date.
    if (status === 'syncing' && !this.syncIds.includes(id)) {
      // Add syncId if it does not already exist:

      if (!this.syncIds.includes(id)) {
        this.syncIds.push(id);
      }
    }
    if (status === 'complete' && this.syncIds.includes(id)) {
      this.syncIds = this.syncIds.filter((syncId) => syncId !== id);
    }

    // Dispatch event to UI.
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

  // Gets SyncIDs from a given config.
  static getIdsFromSyncConfig = (config: SyncIDConfig): SyncID[] | '*' => {
    if (config === '*' || !this.isSyncIdArray(config)) {
      return '*';
    }
    return config;
  };

  // Checks if a sync config is just an array of syncIds.
  static isSyncIdArray = (config: SyncIDConfig): config is SyncID[] =>
    Array.isArray(config) && config.every((item) => typeof item === 'string');
}
