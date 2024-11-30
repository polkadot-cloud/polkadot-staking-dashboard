// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Polkicon } from '@w3ux/react-polkicon';
import { ellipsisFn } from '@w3ux/utils';
import { useOtherAccounts } from 'contexts/Connect/OtherAccounts';
import { useNetwork } from 'contexts/Network';
import { usePrompt } from 'contexts/Prompt';
import { Notifications } from 'controllers/Notifications';
import { useTranslation } from 'react-i18next';
import { ButtonMono, ButtonMonoInvert } from 'ui-buttons';
import { registerSaEvent } from 'utils';
import type { ConfirmProps } from './types';
import { ConfirmWrapper } from './Wrappers';

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
    Notifications.emit({
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
