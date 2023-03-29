// Copyright 2023 @paritytech/polkadot-live authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ButtonMono, ButtonMonoInvert } from '@polkadotcloud/dashboard-ui';
import { registerSaEvent } from 'Utils';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useLedgerHardware } from 'contexts/Hardware/Ledger';
import { useOverlay } from 'contexts/Overlay';
import { Identicon } from 'library/Identicon';
import { useTranslation } from 'react-i18next';
import { ConfirmWrapper } from './Wrappers';
import type { RemoveProps } from './types';

export const Remove = ({ address }: RemoveProps) => {
  const { t } = useTranslation('modals');
  const { network } = useApi();
  const { forgetAccounts } = useConnect();
  const { setStatus } = useOverlay();
  const { getLedgerAccount, removeLedgerAccount } = useLedgerHardware();

  return (
    <ConfirmWrapper>
      <Identicon value={address} size={60} />
      <h3>{t('removeAccount')}</h3>
      <h5>{address}</h5>
      <div className="footer">
        <ButtonMonoInvert text={t('cancel')} onClick={() => setStatus(0)} />
        <ButtonMono
          text={t('removeAccount')}
          onClick={() => {
            const account = getLedgerAccount(address);
            if (account) {
              removeLedgerAccount(address);
              forgetAccounts([account]);
              registerSaEvent(
                `${network.name.toLowerCase()}_ledger_account_removal`
              );
              setStatus(0);
            }
          }}
        />
      </div>
    </ConfirmWrapper>
  );
};
