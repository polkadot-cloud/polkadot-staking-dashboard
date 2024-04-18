// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { registerSaEvent } from 'Utils';
import { Polkicon } from '@w3ux/react-polkicon';
import { useTranslation } from 'react-i18next';
import { usePrompt } from 'contexts/Prompt';
import { ConfirmWrapper } from 'library/Import/Wrappers';
import { useOtherAccounts } from 'contexts/Connect/OtherAccounts';
import { useNetwork } from 'contexts/Network';
import type { RemoveProps } from './types';
import { ellipsisFn } from '@w3ux/utils';
import { NotificationsController } from 'controllers/NotificationsController';
import { ButtonMonoInvert } from 'kits/Buttons/ButtonMonoInvert';
import { ButtonMono } from 'kits/Buttons/ButtonMono';

export const Remove = ({
  address,
  getHandler,
  removeHandler,
  source,
}: RemoveProps) => {
  const { t } = useTranslation('modals');
  const { network } = useNetwork();
  const { setStatus } = usePrompt();
  const { forgetOtherAccounts } = useOtherAccounts();

  const removeAccountCallback = () => {
    NotificationsController.emit({
      title: t('ledgerAccountRemoved'),
      subtitle: t('ledgerRemovedAccount', { account: ellipsisFn(address) }),
    });
  };

  return (
    <ConfirmWrapper>
      <Polkicon address={address} size="3rem" />
      <h3>{t('removeAccount')}</h3>
      <h5>{address}</h5>
      <div className="footer">
        <ButtonMonoInvert text={t('cancel')} onClick={() => setStatus(0)} />
        <ButtonMono
          text={t('removeAccount')}
          onClick={() => {
            const account = getHandler(network, address);
            if (account) {
              removeHandler(network, address, removeAccountCallback);
              forgetOtherAccounts([account]);
              registerSaEvent(
                `${network.toLowerCase()}_${source}_account_removal`
              );
              setStatus(0);
            }
          }}
        />
      </div>
    </ConfirmWrapper>
  );
};
