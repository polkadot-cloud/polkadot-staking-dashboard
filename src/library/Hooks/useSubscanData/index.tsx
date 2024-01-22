// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { usePlugins } from 'contexts/Plugins';
import { useRef, useState } from 'react';
import { SubscanController } from 'static/SubscanController';
import type { PayoutType } from 'static/SubscanController/types';
import { isCustomEvent } from 'static/utils';
import type { AnyJson } from 'types';
import { useEventListener } from 'usehooks-ts';

export const useSubscanData = (
  keys: PayoutType[]
): Partial<Record<PayoutType, AnyJson>> => {
  // Needs access to available plugins to determine whether to respond to event updates.
  const { pluginEnabled } = usePlugins();

  // Store the most up to date subscan data state.
  const [data, setData] = useState<AnyJson>({});

  // Listen for updated data callback. When there are new data, fetch the updated values directly
  // from `SubscanController` and commit to component state.
  const subscanPayoutsUpdatedCallback = (e: Event) => {
    // NOTE: Subscan has to be enabled to continue.
    if (isCustomEvent(e) && pluginEnabled('subscan')) {
      const { keys: receivedKeys }: { keys: PayoutType[] } = e.detail;

      // Filter out any keys that are not provided to the hook.
      const newData: Record<string, AnyJson> = receivedKeys
        .filter((key) => keys.includes(key))
        .map((key) => ({
          [key]: SubscanController.data[key] || [],
        }));

      setData(newData);
    }
  };

  // Listen for new subscan data updates.
  const documentRef = useRef<Document>(document);
  useEventListener(
    'subscan-data-updated',
    subscanPayoutsUpdatedCallback,
    documentRef
  );

  return data;
};
