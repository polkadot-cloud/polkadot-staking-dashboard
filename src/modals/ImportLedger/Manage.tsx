// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { HardwareStatusBar } from '@polkadot-cloud/react';
import { useTranslation } from 'react-i18next';
import { useLedgerHardware } from 'contexts/Hardware/Ledger';
import { getLedgerApp } from 'contexts/Hardware/Utils';
import { useHelp } from 'contexts/Help';
import { usePrompt } from 'contexts/Prompt';
import LedgerSVG from '@polkadot-cloud/assets/extensions/svg/ledger.svg?react';
import { Heading } from 'library/Import/Heading';
import type { AnyJson } from 'types';
import { useOverlay } from '@polkadot-cloud/react/hooks';
import { useNetwork } from 'contexts/Network';
import { Addresess } from './Addresses';
import { Reset } from './Reset';

export const Manage = ({
  addresses,
  handleLedgerLoop,
  removeLedgerAddress,
}: AnyJson) => {
  const { t } = useTranslation();
  const { network } = useNetwork();
  const { setIsExecuting, getIsExecuting, resetStatusCodes, getFeedback } =
    useLedgerHardware();
  const { openPromptWith } = usePrompt();
  const { replaceModal } = useOverlay().modal;
  const { openHelp } = useHelp();

  const { appName, Icon } = getLedgerApp(network);
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
          openPromptWith(
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
        Icon={LedgerSVG}
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
          replaceModal({ key: 'Connect', options: { disableScroll: true } })
        }
        t={{
          tDone: t('done', { ns: 'library' }),
          tCancel: t('cancel', { ns: 'library' }),
        }}
      />
    </>
  );
};
