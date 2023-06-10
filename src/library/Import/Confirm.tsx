// Copyright 2023 @paritytech/polkadot-live authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ButtonMono, ButtonMonoInvert } from '@polkadotcloud/core-ui';
import { registerSaEvent } from 'Utils';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useOverlay } from 'contexts/Overlay';
import { Identicon } from 'library/Identicon';
import { ConfirmWrapper } from 'library/Import/Wrappers';
import { useTranslation } from 'react-i18next';
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
