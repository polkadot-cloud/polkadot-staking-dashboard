// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useUi } from 'contexts/UI';
import { Title } from 'library/Modal/Title';
import { useTranslation } from 'react-i18next';
import { StatusButton } from 'library/StatusButton';
import { PaddingWrapper } from '../Wrappers';

export const Settings = () => {
  const { services, toggleService } = useUi();
  const { t } = useTranslation('common');

  // fetch flag to disable fiat
  const DISABLE_FIAT = Number(process.env.REACT_APP_DISABLE_FIAT ?? 0);

  return (
    <>
      <Title title={t('modals.toggle_services')} />
      <PaddingWrapper>
        <StatusButton
          checked={services.includes('subscan')}
          label="Subscan API"
          onClick={() => {
            toggleService('subscan');
          }}
        />
        {!DISABLE_FIAT && (
          <StatusButton
            checked={services.includes('binance_spot')}
            label="Binance Spot API"
            onClick={() => {
              toggleService('binance_spot');
            }}
          />
        )}
      </PaddingWrapper>
    </>
  );
};

export default Settings;
