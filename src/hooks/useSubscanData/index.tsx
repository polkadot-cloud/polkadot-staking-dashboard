// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { setStateWithRef } from '@w3ux/utils';
import { usePlugins } from 'contexts/Plugins';
import { useEffect, useRef, useState } from 'react';
import { SubscanController } from 'controllers/SubscanController';
import type {
  PayoutType,
  SubscanData,
  SubscanPayout,
  SubscanPayoutData,
} from 'controllers/SubscanController/types';
import { isCustomEvent } from 'controllers/utils';
import { useEventListener } from 'usehooks-ts';
import { useErasToTimeLeft } from '../useErasToTimeLeft';
import { useApi } from 'contexts/Api';
import { useActiveAccounts } from 'contexts/ActiveAccounts';

export const useSubscanData = (keys: PayoutType[]) => {
  const { activeEra } = useApi();
  const { pluginEnabled } = usePlugins();
  const { erasToSeconds } = useErasToTimeLeft();
  const { activeAccount } = useActiveAccounts();

  // Store the most up to date subscan data state.
  const [data, setData] = useState<SubscanData>({});
  const dataRef = useRef(data);

  // Listen for updated data callback. When there are new data, fetch the updated values directly
  // from `SubscanController` and commit to component state.
  const subscanPayoutsUpdatedCallback = (e: Event) => {
    // NOTE: Subscan has to be enabled to continue.
    if (isCustomEvent(e) && pluginEnabled('subscan')) {
      const { keys: receivedKeys }: { keys: PayoutType[] } = e.detail;

      // Filter out any keys that are not provided to the hook active account is still present.
      if (activeAccount) {
        const newData: SubscanData = {};
        receivedKeys
          .filter((key) => keys.includes(key))
          .forEach((key) => {
            newData[key] =
              SubscanController.payoutData[activeAccount]?.[key] || [];
          });

        setStateWithRef({ ...dataRef.current, ...newData }, setData, dataRef);
      }
    }
  };

  // Listen for new subscan data updates.
  const documentRef = useRef<Document>(document);
  useEventListener(
    'subscan-data-updated',
    subscanPayoutsUpdatedCallback,
    documentRef
  );

  // Get data or return an empty array if it is undefined.
  const getData = (withKeys: PayoutType[]): SubscanPayoutData => {
    const result: SubscanPayoutData = {};

    withKeys.forEach((key: PayoutType) => {
      const keyData = (data[key] || []) as SubscanPayout[];
      result[key] = keyData;
    });
    return result;
  };

  // Inject block_timestamp for unclaimed payouts. We take the timestamp of the start of the
  // following payout era - this is the time payouts become available to claim by validators.
  const injectBlockTimestamp = (entries: SubscanPayout[]) => {
    if (!entries) {
      return entries;
    }
    entries.forEach((p) => {
      p.block_timestamp = activeEra.start
        .multipliedBy(0.001)
        .minus(erasToSeconds(activeEra.index.minus(p.era).minus(1)))
        .toNumber();
    });
    return entries;
  };

  // Populate state on initial render if data is already available.
  useEffect(() => {
    if (activeAccount) {
      const newData: SubscanData = {};
      keys.forEach((key: PayoutType) => {
        newData[key] = SubscanController.payoutData[activeAccount]?.[key] || [];
      });
      setStateWithRef({ ...dataRef.current, ...newData }, setData, dataRef);
    }
  }, [activeAccount]);

  return { data, getData, injectBlockTimestamp };
};
