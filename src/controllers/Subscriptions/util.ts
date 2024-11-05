// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { SubscriptionsController } from '.';
import type { ObservableGetSubscription, Subscription } from './types';
import type { NetworkName, SystemChainId } from 'types';

// Gets a result from an Observable class asynchronously, and adds the process to the subscriptions
// controller. This ensures that the process is tidied up if the API is terminated before the
// subscription is resolved.
export const getDataFromObservable = async (
  network: NetworkName | SystemChainId,
  subscriptionKey: string,
  getter: Subscription
) => {
  // Instantiate chain spec observable and add it to subscriptions in case the Api is terminated
  // before the subscription is resolved.
  const observable = SubscriptionsController.set(
    network,
    subscriptionKey,
    getter
  ) as ObservableGetSubscription;

  // Get the result from the observable.
  let result = undefined;
  if (observable) {
    result = await observable.get();
  }

  // Remove the subscription from the controller.
  SubscriptionsController.remove(network, subscriptionKey);
  return result;
};
