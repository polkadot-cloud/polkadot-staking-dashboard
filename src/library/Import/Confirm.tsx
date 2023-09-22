// Copyright 2023 @paritytech/polkadot-live authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ButtonMono, ButtonMonoInvert, Polkicon } from '@polkadot-cloud/react';
import { useTranslation } from 'react-i18next';
import { useConnect } from 'contexts/Connect';
import { usePrompt } from 'contexts/Prompt';

import { ConfirmWrapper } from 'library/Import/Wrappers';
import type { ConfirmProps } from './types';

export const Confirm = ({ address, index, addHandler }: ConfirmProps) => {
  const { t } = useTranslation('modals');
  const { addToAccounts } = useConnect();
  const { setStatus } = usePrompt();

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
            const account = addHandler(address, index);
            if (account) {
              addToAccounts([account]);
            }
            setStatus(0);
          }}
        />
      </div>
    </ConfirmWrapper>
  );
};
