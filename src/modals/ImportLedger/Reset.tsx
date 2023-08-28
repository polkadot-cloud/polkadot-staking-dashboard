// Copyright 2023 @paritytech/polkadot-live authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { registerSaEvent } from 'Utils';
import { useApi } from 'contexts/Api';
import { ButtonMono, ButtonMonoInvert } from '@polkadot-cloud/react';
import { useTranslation } from 'react-i18next';
import { useConnect } from 'contexts/Connect';
import type { LedgerAccount } from 'contexts/Connect/types';
import { useLedgerHardware } from 'contexts/Hardware/Ledger';
import { getLocalLedgerAddresses } from 'contexts/Hardware/Utils';
import type { LedgerAddress } from 'contexts/Hardware/types';
import { usePrompt } from 'contexts/Prompt';
import { ConfirmWrapper } from 'library/Import/Wrappers';
import type { AnyJson } from 'types';
import { useOverlay } from '@polkadot-cloud/react/hooks';

export const Reset = ({ removeLedgerAddress }: AnyJson) => {
  const { t } = useTranslation('modals');
  const { network } = useApi();
  const { setStatus } = usePrompt();
  const { forgetAccounts } = useConnect();
  const { replaceModal } = useOverlay().modal;
  const { ledgerAccounts, removeLedgerAccount } = useLedgerHardware();

  const removeAccounts = () => {
    // Remove imported Ledger accounts.
    ledgerAccounts.forEach((account: LedgerAccount) => {
      removeLedgerAccount(account.address);
    });
    forgetAccounts(ledgerAccounts);

    // Remove local Ledger addresses.
    getLocalLedgerAddresses().forEach((address: LedgerAddress) => {
      removeLedgerAddress(address.address);
    });

    // Go back to Connect modal.
    replaceModal({ key: 'Connect', options: { disableScroll: true } });
  };

  return (
    <ConfirmWrapper>
      <h3>{t('resetLedgerAccounts')}</h3>
      <p>{t('ledgerWillBeReset')}</p>
      <div className="footer">
        <ButtonMonoInvert text={t('cancel')} onClick={() => setStatus(0)} />
        <ButtonMono
          text={t('confirmReset')}
          onClick={() => {
            removeAccounts();
            registerSaEvent(
              `${network.name.toLowerCase()}_ledger_accounts_reset`
            );
            setStatus(0);
          }}
        />
      </div>
    </ConfirmWrapper>
  );
};
