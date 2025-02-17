// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { LearningProvider } from 'contexts/Learning'
import { useTranslation } from 'react-i18next'
import { Page } from 'ui-core/base'
import { GuideContent } from './GuideContent'
import { LearningPaths } from './LearningPaths'
import { ResourcesWrapper } from './Wrappers'

export const Learning = () => {
  const { t } = useTranslation('pages')

  return (
    <LearningProvider>
      <Page.Title title={t('learning.title')} />
      <Page.Row>
        <ResourcesWrapper>
          <LearningPaths />
          <GuideContent />
        </ResourcesWrapper>
      </Page.Row>
    </LearningProvider>
  )
}
