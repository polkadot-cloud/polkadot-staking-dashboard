// Copyright 2023 @paritytech/polkadot-live authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import { useLedgerHardware } from 'contexts/Hardware/Ledger';
import { getLedgerApp } from 'contexts/Hardware/Utils';
import { useOverlay } from 'contexts/Overlay';
import { ReactComponent as StatusBarIcon } from 'img/ledgerIcon.svg';
import { Heading } from 'library/Import/Heading';
import { StatusBar } from 'library/Import/StatusBar';
import { useTranslation } from 'react-i18next';
import type { AnyJson } from 'types';
import { Addresess } from './Addresses';
import { Reset } from './Reset';

export const Manage = ({
  addresses,
  handleLedgerLoop,
  removeLedgerAddress,
}: AnyJson) => {
  const { t } = useTranslation('modals');
  const { name } = useApi().network;
  const { setIsExecuting, getIsExecuting, resetStatusCodes, getFeedback } =
    useLedgerHardware();
  const { openOverlayWith } = useOverlay();
  const { appName, Icon } = getLedgerApp(name);
  const isExecuting = getIsExecuting();

  const fallbackMessage = `${t('ledgerAccounts', { count: addresses.length })}`;
  const feedback = getFeedback();
  const helpKey = feedback?.helpKey;

  return (
    <>
      <Heading
        connectTo="Ledger"
        title={appName}
        Icon={Icon}
        disabled={!addresses.length}
        handleReset={() => {
          openOverlayWith(
            <Reset removeLedgerAddress={removeLedgerAddress} />,
            'small'
          );
        }}
      />
      <Addresess
        addresses={addresses}
        handleLedgerLoop={handleLedgerLoop}
        removeLedgerAddress={removeLedgerAddress}
      />
      <StatusBar
        StatusBarIcon={StatusBarIcon}
        text={feedback?.message || fallbackMessage}
        helpKey={helpKey}
        inProgress={isExecuting}
        handleCancel={() => {
          setIsExecuting(false);
          resetStatusCodes();
        }}
      />
    </>
  );
};
