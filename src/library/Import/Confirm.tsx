// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { registerSaEvent } from 'Utils';
import { Polkicon } from '@w3ux/react-polkicon';
import { useTranslation } from 'react-i18next';
import { usePrompt } from 'contexts/Prompt';
import { ConfirmWrapper } from 'library/Import/Wrappers';
import { useOtherAccounts } from 'contexts/Connect/OtherAccounts';
import { useNetwork } from 'contexts/Network';
import type { ConfirmProps } from './types';
import { NotificationsController } from 'static/NotificationsController';
import { ellipsisFn } from '@w3ux/utils';
import { ButtonMonoInvert } from 'kits/Buttons/ButtonMonoInvert';
import { ButtonMono } from 'kits/Buttons/ButtonMono';

export const Confirm = ({
  address,
  index,
  addHandler,
  source,
}: ConfirmProps) => {
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
      <Polkicon address={address} size="3rem" />
      <h3>{t('importAccount')}</h3>
      <h5>{address}</h5>
      <div className="footer">
        <ButtonMonoInvert text={t('cancel')} onClick={() => setStatus(0)} />
        <ButtonMono
          text={t('importAccount')}
          onClick={() => {
            const account = addHandler(address, index, addAccountCallback);
            if (account) {
              addOtherAccounts([account]);
              registerSaEvent(
                `${network.toLowerCase()}_${source}_account_import`
              );
            }
            setStatus(0);
          }}
        />
      </div>
    </ConfirmWrapper>
  );
};
