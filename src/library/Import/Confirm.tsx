// Copyright 2023 @paritytech/polkadot-live authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ButtonMono, ButtonMonoInvert } from '@polkadotcloud/core-ui';
import { useConnect } from 'contexts/Connect';
import { useOverlay } from 'contexts/Overlay';
import { Identicon } from 'library/Identicon';
import { ConfirmWrapper } from 'library/Import/Wrappers';
import { useTranslation } from 'react-i18next';
import type { ConfirmProps } from './types';

export const Confirm = ({ address, index, addHandler }: ConfirmProps) => {
  const { t } = useTranslation('modals');
  const { addToAccounts } = useConnect();
  const { setStatus } = useOverlay();

  return (
    <ConfirmWrapper>
      <Identicon value={address} size={60} />
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
