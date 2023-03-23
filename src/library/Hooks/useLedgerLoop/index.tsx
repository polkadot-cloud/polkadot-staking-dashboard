// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useLedgerHardware } from 'contexts/Hardware/Ledger';
import { useTxMeta } from 'contexts/TxMeta';
import { useEffect } from 'react';
import type { LederLoopProps } from './types';

export const useLedgerLoop = ({ tasks, options, mounted }: LederLoopProps) => {
  const {
    setIsPaired,
    getTransport,
    handleErrors,
    setIsExecuting,
    getIsExecuting,
    getStatusCodes,
    executeLedgerLoop,
    transportResponse,
  } = useLedgerHardware();
  const { getTxPayload } = useTxMeta();

  // Connect to Ledger device and perform necessary tasks.
  //
  // The tasks sent to the device depend on the current state of the import process. The interval is
  // cleared once the address has been successfully fetched.
  let interval: ReturnType<typeof setInterval>;
  const handleLedgerLoop = () => {
    interval = setInterval(async () => {
      // If the import modal is no longer open, cancel interval and reset import state.
      if (!mounted()) {
        clearInterval(interval);
        return;
      }

      // If the app is not open on-device, or device is not connected, cancel execution and interval
      // until the user tries again.
      if (
        [
          'DeviceNotConnected',
          'AppNotOpenContinue',
          'AppNotOpen',
          'TransactionRejected',
        ].includes(getStatusCodes()[0]?.statusCode)
      ) {
        setIsPaired('unpaired');
        setIsExecuting(false);
        clearInterval(interval);
        return;
      }

      // Attempt to carry out tasks on-device.
      try {
        // get task arguments if they have been provided.
        const accountIndex = options?.accountIndex ? options.accountIndex() : 0;

        // initialise payload.
        if (options?.payload && !getTxPayload()) {
          await options.payload();
        }
        // get payload.
        const payload = getTxPayload();

        if (getIsExecuting()) {
          await executeLedgerLoop(getTransport(), tasks, {
            accountIndex,
            payload,
          });
        }
      } catch (err) {
        console.log(err);
        handleErrors(err);
      }
    }, 750);
  };

  // Listen for new Ledger status reports.
  useEffect(() => {
    if (!getIsExecuting()) {
      clearInterval(interval);
    }
  }, [transportResponse, getIsExecuting()]);

  return { handleLedgerLoop };
};
