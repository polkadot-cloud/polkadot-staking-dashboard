// Copyright 2023 @paritytech/polkadot-live authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { registerSaEvent } from 'Utils';
import { ButtonMono, ButtonMonoInvert, Polkicon } from '@polkadot-cloud/react';
import { useTranslation } from 'react-i18next';
import { usePrompt } from 'contexts/Prompt';
import { ConfirmWrapper } from 'library/Import/Wrappers';
import { useOtherAccounts } from 'contexts/Connect/OtherAccounts';
import { useNetwork } from 'contexts/Network';
import type { RemoveProps } from './types';

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
            const account = getHandler(address);
            if (account) {
              removeHandler(address);
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
