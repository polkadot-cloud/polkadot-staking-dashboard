// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { usePlugins } from 'contexts/Plugins';
import { Title } from 'library/Modal/Title';
import { StatusButton } from 'library/StatusButton';
import { useTranslation } from 'react-i18next';
import { PaddingWrapper } from '../Wrappers';

export const Settings = () => {
  const { plugins, togglePlugin } = usePlugins();
  const { t } = useTranslation('modals');

  // fetch flag to disable fiat
  const DISABLE_FIAT = Number(process.env.REACT_APP_DISABLE_FIAT ?? 0);

  return (
    <>
      <Title title={t('settings')} />
      <PaddingWrapper>
        <h4>{t('togglePlugins')}</h4>
        <StatusButton
          checked={plugins.includes('subscan')}
          label="Subscan API"
          onClick={() => {
            togglePlugin('subscan');
          }}
        />
        {!DISABLE_FIAT && (
          <StatusButton
            checked={plugins.includes('binance_spot')}
            label={t('binanceApi')}
            onClick={() => {
              togglePlugin('binance_spot');
            }}
          />
        )}

        <h4>{t('toggleFeatures')}</h4>

        <StatusButton
          checked={plugins.includes('tips')}
          label={t('dashboardTips')}
          onClick={() => {
            togglePlugin('tips');
          }}
        />
      </PaddingWrapper>
    </>
  );
};

export default Settings;
