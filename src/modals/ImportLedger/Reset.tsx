// Copyright 2023 @paritytech/polkadot-live authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ButtonMono, ButtonMonoInvert } from '@polkadotcloud/core-ui';
import { useTranslation } from 'react-i18next';
import { useConnect } from 'contexts/Connect';
import type { LedgerAccount } from 'contexts/Connect/types';
import { useLedgerHardware } from 'contexts/Hardware/Ledger';
import { getLocalLedgerAddresses } from 'contexts/Hardware/Utils';
import type { LedgerAddress } from 'contexts/Hardware/types';
import { useModal } from 'contexts/Modal';
import { useOverlay } from 'contexts/Overlay';
import { ConfirmWrapper } from 'library/Import/Wrappers';
import type { AnyJson } from 'types';

export const Reset = ({ removeLedgerAddress }: AnyJson) => {
  const { t } = useTranslation('modals');
  const { forgetAccounts } = useConnect();
  const { setStatus } = useOverlay();
  const { replaceModalWith } = useModal();
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
    replaceModalWith('Connect', { disableScroll: true }, 'large');
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
