// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useTranslation } from 'react-i18next';
import { usePlugins } from 'contexts/Plugins';
import { Title } from 'library/Modal/Title';
import { StatusButton } from 'library/StatusButton';
import { ContentWrapper } from '../Networks/Wrapper';
import { ModalPadding } from 'kits/Overlay/structure/ModalPadding';

export const Settings = () => {
  const { plugins, togglePlugin } = usePlugins();
  const { t } = useTranslation('modals');

  return (
    <>
      <Title title={t('settings')} />
      <ModalPadding>
        <ContentWrapper>
          <h4>{t('togglePlugins')}</h4>
          <StatusButton
            checked={plugins.includes('staking_api')}
            label="Staking API"
            onClick={() => togglePlugin('staking_api')}
          />
          <StatusButton
            checked={plugins.includes('subscan')}
            label="Subscan API"
            onClick={() => togglePlugin('subscan')}
          />
          <StatusButton
            checked={plugins.includes('polkawatch')}
            label="Polkawatch API"
            onClick={() => togglePlugin('polkawatch')}
          />

          <h4>{t('toggleFeatures')}</h4>

          <StatusButton
            checked={plugins.includes('tips')}
            label={t('dashboardTips')}
            onClick={() => togglePlugin('tips')}
          />
        </ContentWrapper>
      </ModalPadding>
    </>
  );
};
