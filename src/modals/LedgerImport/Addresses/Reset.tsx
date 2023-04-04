// Copyright 2023 @paritytech/polkadot-live authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ButtonMono, ButtonMonoInvert } from '@polkadotcloud/core-ui';
import { registerSaEvent } from 'Utils';
import { useApi } from 'contexts/Api';
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
  const { network } = useApi();
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

    // Remove local Ledger addresses.
    getLocalLedgerAddresses().forEach((address: LedgerAddress) => {
      removeLedgerAddress(address.address);
    });

    // Go back to Connect modal.
    replaceModalWith('Connect', {}, 'large');
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
