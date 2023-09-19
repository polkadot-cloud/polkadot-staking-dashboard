// Copyright 2023 @paritytech/polkadot-live authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  ButtonMono,
  ButtonMonoInvert,
  PolkadotIcon,
} from '@polkadot-cloud/react';
import { useTranslation } from 'react-i18next';
import { useConnect } from 'contexts/Connect';
import { usePrompt } from 'contexts/Prompt';
import { ConfirmWrapper } from 'library/Import/Wrappers';
import type { RemoveProps } from './types';

export const Remove = ({ address, getHandler, removeHandler }: RemoveProps) => {
  const { t } = useTranslation('modals');
  const { forgetAccounts } = useConnect();
  const { setStatus } = usePrompt();

  return (
    <ConfirmWrapper>
      <PolkadotIcon address={address} size={60} />
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
              setStatus(0);
            }
          }}
        />
      </div>
    </ConfirmWrapper>
  );
};
