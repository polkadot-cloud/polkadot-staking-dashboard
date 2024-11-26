// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useLedgerAccounts } from '@w3ux/react-connect-kit';
import type { LedgerAccount } from '@w3ux/react-connect-kit/types';
import type { AnyJson } from '@w3ux/types';
import { useOtherAccounts } from 'contexts/Connect/OtherAccounts';
import { getLocalLedgerAddresses } from 'contexts/LedgerHardware/Utils';
import type { LedgerAddress } from 'contexts/LedgerHardware/types';
import { useNetwork } from 'contexts/Network';
import { usePrompt } from 'contexts/Prompt';
import { useOverlay } from 'kits/Overlay/Provider';
import { ConfirmWrapper } from 'library/Import/Wrappers';
import { useTranslation } from 'react-i18next';
import { ButtonMono, ButtonMonoInvert } from 'ui-buttons';

export const Reset = ({ removeLedgerAddress }: AnyJson) => {
  const { t } = useTranslation('modals');
  const { setStatus } = usePrompt();
  const { network } = useNetwork();
  const { replaceModal } = useOverlay().modal;
  const { forgetOtherAccounts } = useOtherAccounts();
  const { removeLedgerAccount, ledgerAccounts } = useLedgerAccounts();

  const removeAccounts = () => {
    // Remove imported Ledger accounts.
    ledgerAccounts.forEach((account: LedgerAccount) => {
      removeLedgerAccount(network, account.address);
    });
    forgetOtherAccounts(ledgerAccounts);

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
            setStatus(0);
          }}
        />
      </div>
    </ConfirmWrapper>
  );
};
