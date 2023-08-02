// Copyright 2023 @paritytech/polkadot-live authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { HardwareStatusBar } from '@polkadotcloud/core-ui';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { useLedgerHardware } from 'contexts/Hardware/Ledger';
import { getLedgerApp } from 'contexts/Hardware/Utils';
import { useHelp } from 'contexts/Help';
import { useModal } from 'contexts/Modal';
import { useOverlay } from 'contexts/Overlay';
import { ReactComponent as StatusBarIcon } from 'img/ledgerIcon.svg';
import { Heading } from 'library/Import/Heading';
import type { AnyJson } from 'types';
import { Addresess } from './Addresses';
import { Reset } from './Reset';

export const Manage = ({
  addresses,
  handleLedgerLoop,
  removeLedgerAddress,
}: AnyJson) => {
  const { t } = useTranslation();
  const { name } = useApi().network;
  const { setIsExecuting, getIsExecuting, resetStatusCodes, getFeedback } =
    useLedgerHardware();
  const { openOverlayWith } = useOverlay();
  const { replaceModalWith } = useModal();
  const { openHelp } = useHelp();

  const { appName, Icon } = getLedgerApp(name);
  const isExecuting = getIsExecuting();

  const fallbackMessage = `${t('ledgerAccounts', {
    ns: 'modals',
    count: addresses.length,
  })}`;
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
      <HardwareStatusBar
        show
        Icon={StatusBarIcon}
        text={feedback?.message || fallbackMessage}
        help={
          helpKey
            ? {
                helpKey,
                handleHelp: openHelp,
              }
            : undefined
        }
        inProgress={isExecuting}
        handleCancel={() => {
          setIsExecuting(false);
          resetStatusCodes();
        }}
        handleDone={() =>
          replaceModalWith('Connect', { disableScroll: true }, 'large')
        }
        t={{
          tDone: t('done', { ns: 'library' }),
          tCancel: t('cancel', { ns: 'library' }),
        }}
      />
    </>
  );
};
