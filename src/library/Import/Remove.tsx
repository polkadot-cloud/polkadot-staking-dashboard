// Copyright 2023 @paritytech/polkadot-live authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { registerSaEvent } from 'Utils';
import { useApi } from 'contexts/Api';
import { ButtonMono, ButtonMonoInvert } from '@polkadot-cloud/react';
import { useTranslation } from 'react-i18next';
import { useConnect } from 'contexts/Connect';
import { usePrompt } from 'contexts/Prompt';
import { Identicon } from 'library/Identicon';
import { ConfirmWrapper } from 'library/Import/Wrappers';
import type { RemoveProps } from './types';

export const Remove = ({
  address,
  getHandler,
  removeHandler,
  source,
}: RemoveProps) => {
  const { t } = useTranslation('modals');
  const { network } = useApi();
  const { forgetAccounts } = useConnect();
  const { setStatus } = usePrompt();

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
            const account = getHandler(address);
            if (account) {
              removeHandler(address);
              forgetAccounts([account]);
              registerSaEvent(
                `${network.name.toLowerCase()}_${source}_account_removal`
              );
              setStatus(0);
            }
          }}
        />
      </div>
    </ConfirmWrapper>
  );
};
