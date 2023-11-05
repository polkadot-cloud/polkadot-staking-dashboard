// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { HardwareStatusBar } from '@polkadot-cloud/react';
import { useTranslation } from 'react-i18next';
import { useLedgerHardware } from 'contexts/Hardware/Ledger/LedgerHardware';
import { getLedgerApp } from 'contexts/Hardware/Utils';
import { useHelp } from 'contexts/Help';
import { usePrompt } from 'contexts/Prompt';
import LedgerSVG from '@polkadot-cloud/assets/extensions/svg/ledgersquare.svg?react';
import { Heading } from 'library/Import/Heading';
import type { AnyJson } from 'types';
import { useOverlay } from '@polkadot-cloud/react/hooks';
import { useNetwork } from 'contexts/Network';
import { Addresess } from './Addresses';
import { Reset } from './Reset';

export const Manage = ({
  addresses,
  onGetAddress,
  removeLedgerAddress,
}: AnyJson) => {
  const { t } = useTranslation();
  const { openHelp } = useHelp();
  const { network } = useNetwork();
  const { openPromptWith } = usePrompt();
  const { replaceModal } = useOverlay().modal;
  const { handleResetLedgerTask, getIsExecuting, getFeedback } =
    useLedgerHardware();
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
        Icon={Icon}
        title={appName}
        handleReset={() => {
          openPromptWith(
            <Reset removeLedgerAddress={removeLedgerAddress} />,
            'small'
          );
        }}
        disabled={!addresses.length}
      />
      <Addresess
        addresses={addresses}
        removeLedgerAddress={removeLedgerAddress}
        onGetAddress={onGetAddress}
      />
      <HardwareStatusBar
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
        handleCancel={() => handleResetLedgerTask()}
        handleDone={() =>
          replaceModal({ key: 'Connect', options: { disableScroll: true } })
        }
        show
        t={{
          tDone: t('done', { ns: 'library' }),
          tCancel: t('cancel', { ns: 'library' }),
        }}
      />
    </>
  );
};
