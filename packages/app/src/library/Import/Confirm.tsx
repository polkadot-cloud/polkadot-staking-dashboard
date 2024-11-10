// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Polkicon } from '@w3ux/react-polkicon';
import { useTranslation } from 'react-i18next';
import { usePrompt } from 'contexts/Prompt';

import { ConfirmWrapper } from 'library/Import/Wrappers';
import { useOtherAccounts } from 'contexts/Connect/OtherAccounts';
import type { ConfirmProps } from './types';
import { NotificationsController } from 'controllers/Notifications';
import { ellipsisFn } from '@w3ux/utils';
import { ButtonMonoInvert } from 'kits/Buttons/ButtonMonoInvert';
import { ButtonMono } from 'ui-buttons';
import { useNetwork } from 'contexts/Network';

export const Confirm = ({ address, index, addHandler }: ConfirmProps) => {
  const { t } = useTranslation('modals');
  const { network } = useNetwork();
  const { setStatus } = usePrompt();
  const { addOtherAccounts } = useOtherAccounts();

  const addAccountCallback = () => {
    NotificationsController.emit({
      title: t('ledgerAccountImported'),
      subtitle: t('ledgerImportedAccount', {
        account: ellipsisFn(address),
      }),
    });
  };

  return (
    <ConfirmWrapper>
      <h2>
        <Polkicon address={address} transform="grow-10" />
      </h2>
      <h3>{t('importAccount')}</h3>
      <h5>{address}</h5>
      <div className="footer">
        <ButtonMonoInvert text={t('cancel')} onClick={() => setStatus(0)} />
        <ButtonMono
          text={t('importAccount')}
          onClick={() => {
            const account = addHandler(
              network,
              address,
              index,
              addAccountCallback
            );
            if (account) {
              addOtherAccounts([account]);
            }
            setStatus(0);
          }}
        />
      </div>
    </ConfirmWrapper>
  );
};
