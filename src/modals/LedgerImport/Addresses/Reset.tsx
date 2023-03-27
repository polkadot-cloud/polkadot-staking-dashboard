// Copyright 2023 @paritytech/polkadot-live authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ButtonMono, ButtonMonoInvert } from '@polkadotcloud/dashboard-ui';
import { useConnect } from 'contexts/Connect';
import type { LedgerAccount } from 'contexts/Connect/types';
import { useLedgerHardware } from 'contexts/Hardware/Ledger';
import { getLocalLedgerAddresses } from 'contexts/Hardware/Utils';
import type { LedgerAddress } from 'contexts/Hardware/types';
import { useModal } from 'contexts/Modal';
import { useOverlay } from 'contexts/Overlay';
import { useTranslation } from 'react-i18next';
import type { AnyJson } from 'types';
import { ConfirmWrapper } from './Wrappers';

export const Reset = ({ removeLedgerAddress }: AnyJson) => {
  const { t } = useTranslation('modals');
  const { setStatus } = useOverlay();
  const { forgetAccounts } = useConnect();
  const { ledgerAccounts, removeLedgerAccount } = useLedgerHardware();
  const { replaceModalWith } = useModal();

  const removeAccounts = () => {
    // Remove imported Ledger accounts.
    ledgerAccounts.forEach((account: LedgerAccount) => {
      removeLedgerAccount(account.address);
    });
    forgetAccounts(ledgerAccounts);

    // Remove local ledger addresses.
    getLocalLedgerAddresses().forEach((address: LedgerAddress) => {
      removeLedgerAddress(address.address);
    });

    // Go back to Connect modal.
    replaceModalWith('Connect', {}, 'large');
  };

  return (
    <ConfirmWrapper>
      <h3>Reset Ledger Accounts</h3>
      <p>
        Your Ledger address list will be reset, and any imported accounts will
        be removed from the dashboard.
      </p>
      <div className="footer">
        <ButtonMonoInvert text={t('cancel')} onClick={() => setStatus(0)} />
        <ButtonMono
          text="Confirm Reset"
          onClick={() => {
            removeAccounts();
            setStatus(0);
          }}
        />
      </div>
    </ConfirmWrapper>
  );
};
