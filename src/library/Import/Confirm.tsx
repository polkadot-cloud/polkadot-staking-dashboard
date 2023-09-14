// Copyright 2023 @paritytech/polkadot-live authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { registerSaEvent } from 'Utils';
import { useApi } from 'contexts/Api';
import {
  ButtonMono,
  ButtonMonoInvert,
  PolkadotIcon,
} from '@polkadot-cloud/react';
import { useTranslation } from 'react-i18next';
import { useConnect } from 'contexts/Connect';
import { usePrompt } from 'contexts/Prompt';
import { useTheme } from 'contexts/Themes';

import { ConfirmWrapper } from 'library/Import/Wrappers';
import type { ConfirmProps } from './types';

export const Confirm = ({
  address,
  index,
  addHandler,
  source,
}: ConfirmProps) => {
  const { t } = useTranslation('modals');
  const { network } = useApi();
  const { addToAccounts } = useConnect();
  const { setStatus } = usePrompt();
  const { mode } = useTheme();
  return (
    <ConfirmWrapper>
      <PolkadotIcon dark={mode === 'dark'} nocopy address={address} size={60} />
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
              registerSaEvent(
                `${network.name.toLowerCase()}_${source}_account_import`
              );
            }
            setStatus(0);
          }}
        />
      </div>
    </ConfirmWrapper>
  );
};
