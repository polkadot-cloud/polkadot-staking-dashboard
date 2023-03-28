// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import { useLedgerHardware } from 'contexts/Hardware/Ledger';
import { getLedgerApp } from 'contexts/Hardware/Utils';
import { useTxMeta } from 'contexts/TxMeta';
import type { LederLoopProps } from './types';

export const useLedgerLoop = ({ tasks, options, mounted }: LederLoopProps) => {
  const {
    setIsPaired,
    getTransport,
    getIsExecuting,
    getStatusCodes,
    executeLedgerLoop,
  } = useLedgerHardware();
  const {
    network: { name },
  } = useApi();
  const { getTxPayload } = useTxMeta();
  const { appName } = getLedgerApp(name);

  // Connect to Ledger device and perform necessary tasks.
  //
  // The tasks sent to the device depend on the current state of the import process.
  const handleLedgerLoop = async () => {
    // If the import modal is no longer open, cancel execution.
    if (!mounted()) {
      return;
    }

    // If the app is not open on-device, or device is not connected, cancel execution.
    // If we are to explore auto looping via an interval, this may wish to use `determineStatusFromCode` instead.
    if (['DeviceNotConnected'].includes(getStatusCodes()[0]?.statusCode)) {
      setIsPaired('unpaired');
    } else {
      // Get task options and execute the loop.
      const uid = options?.uid || 0;
      const accountIndex = options?.accountIndex ? options.accountIndex() : 0;
      const payload = await getTxPayload(uid);

      if (getIsExecuting()) {
        await executeLedgerLoop(appName, getTransport(), tasks, {
          accountIndex,
          payload,
        });
      }
    }
  };

  return { handleLedgerLoop };
};
