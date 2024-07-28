// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { AnyJson } from '@w3ux/types';

// Define all possible subscription classes.
// TODO: Add subscription classes here.
export type Subscription = AnyJson;

// the record of subscriptions, keyed by tabId.
export type ChainSubscriptions = Record<string, Subscription>;

// Abstract class that ensures all subscription classes have an unsubscribe method.
export abstract class Unsubscribable {
  // Unsubscribe from unsubs present in this class.
  abstract unsubscribe: () => void;
}
