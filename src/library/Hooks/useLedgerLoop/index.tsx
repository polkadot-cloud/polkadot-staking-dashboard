// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useLedgerHardware } from 'contexts/Hardware/Ledger';
import { getLedgerApp } from 'contexts/Hardware/Utils';
import { useTxMeta } from 'contexts/TxMeta';
import { useNetwork } from 'contexts/Network';
import type { LederLoopProps } from './types';

export const useLedgerLoop = ({ task, options, mounted }: LederLoopProps) => {
  const {
    setIsPaired,
    getIsExecuting,
    getStatusCodes,
    executeLedgerLoop,
    handleErrors,
  } = useLedgerHardware();
  const { network } = useNetwork();
  const { getTxPayload, getPayloadUid } = useTxMeta();
  const { appName } = getLedgerApp(network);

  // Connect to Ledger device and perform necessary tasks.
  const handleLedgerLoop = async () => {
    // If the active modal is no longer open, cancel execution.
    if (!mounted()) return;

    // If the app is not open on-device, or device is not connected, cancel execution.
    // If we are to explore auto looping via an interval, this may wish to use `determineStatusFromCode` instead.
    if (['DeviceNotConnected'].includes(getStatusCodes()[0]?.statusCode)) {
      setIsPaired('unpaired');
    } else {
      // Get task options and execute the loop.
      const uid = getPayloadUid();
      const accountIndex = options?.accountIndex ? options.accountIndex() : 0;
      try {
        const payload = await getTxPayload();
        if (getIsExecuting()) {
          await executeLedgerLoop(appName, task, {
            uid,
            accountIndex,
            payload,
          });
        }
      } catch (err) {
        handleErrors(appName, err);
      }
    }
  };

  return { handleLedgerLoop };
};
