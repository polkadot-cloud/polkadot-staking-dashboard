// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { LedgerResponse } from 'contexts/Hardware/types';
import { useTranslation } from 'react-i18next';
import type { AnyJson } from 'types';

// formats a title and subtitle depending on the Ledger code received.
export const getDisplayFromLedgerCode = (
  appName: string,
  statusCode: string,
  inStatusBar = false
) => {
  const { t } = useTranslation('modals');
  let title;

  switch (statusCode) {
    case 'DeviceNotConnected':
      title = inStatusBar ? t('waitingForLedger') : t('ledgerNotConnected');
      break;
    case 'AppNotOpen':
      title = t('unlockYourLedger', { appName });
      break;
    case 'AppNotOpenContinue':
      title = t('openLedgerApp', { appName });
      break;
    case 'TransactionRejected':
      title = t('transactionWasRejected');
      break;
    case 'GettingAddress':
      title = t('gettingAddress');
      break;
    case 'SigningPayload':
      title = t('signingTransaction');
      break;
    case 'ReceivedAddress':
      title = t('successfullyFetchedAddress');
      break;
    default:
      title = t('connectingToDevice');
  }
  return { title, statusCode };
};

// Determine the status of connection process.
export const determineStatusFromCodes = (
  appName: string,
  responses: Array<LedgerResponse>,
  inStatusBar: boolean
) => {
  if (!responses.length) {
    return getDisplayFromLedgerCode(appName, '', inStatusBar);
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
  return getDisplayFromLedgerCode(appName, trueCode || '', inStatusBar);
};
