// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { LedgerResponse, LedgerStatusCode } from 'contexts/Hardware/types';
import type { AnyJson } from 'types';

// Determine the status of connection process.
export const determineStatusFromCodes = (
  responses: Array<LedgerResponse>
): LedgerStatusCode | null => {
  if (!responses.length) {
    return null;
  }

  const latestStatusCode: LedgerStatusCode = responses[0].statusCode;

  // Check that all responses are DeviceNotConnected before displaying the UI.
  let trueCode = latestStatusCode;
  if (latestStatusCode === 'DeviceNotConnected') {
    responses.every((b: AnyJson) => {
      if (b.statusCode !== 'DeviceNotConnected') {
        trueCode = b.statusCode;
        return false;
      }
      return true;
    });
  }
  return trueCode;
};
