// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { LedgerResponse } from 'contexts/Hardware/types';
import type { AnyJson } from 'types';

// formats a title and subtitle depending on the Ledger code received.
export const getDisplayFromLedgerCode = (
  statusCode: string,
  inStatusBar = false
) => {
  let title;

  switch (statusCode) {
    case 'DeviceNotConnected':
      title = inStatusBar
        ? 'Waiting For Ledger Device'
        : 'Ledger Not Connected';
      break;
    case 'AppNotOpen':
      title = 'Unlock your Ledger device and open the Polkadot app.';
      break;
    case 'OpenAppToContinue':
      title = 'Open the Polkadot app on Ledger and try again.';
      break;
    case 'GettingAddress':
      title = 'Getting Address...';
      break;
    case 'ReceivedAddress':
      title = 'Successfully Fetched Address';
      break;
    default:
      title = 'Connecting to Device...';
  }
  return { title };
};

// Determine the status of connection process.
export const determineStatusFromCodes = (
  responses: Array<LedgerResponse>,
  inStatusBar: boolean
) => {
  if (!responses.length) {
    return getDisplayFromLedgerCode('', inStatusBar);
  }

  const latestStatusCode: string = responses[0].statusCode;
  let trueCode = latestStatusCode;

  // Check that all responses are DeviceNotConnected before displaying the UI.
  if (latestStatusCode === 'DeviceNotConnected') {
    responses.every((b: AnyJson) => {
      if (b.statusCode !== 'DeviceNotConnected') {
        trueCode = b.statusCode;
        return false;
      }
      return true;
    });
  }
  return getDisplayFromLedgerCode(trueCode || '', inStatusBar);
};
