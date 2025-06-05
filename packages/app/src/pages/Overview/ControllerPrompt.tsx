// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  faChevronCircleRight,
  faWarning,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useThemeValues } from 'contexts/ThemeValues'
import { CardWrapper } from 'library/Card/Wrappers'
import { useTranslation } from 'react-i18next'
import { ButtonPrimary } from 'ui-buttons'
import { ButtonRow, Page } from 'ui-core/base'
import { useOverlay } from 'ui-overlay'

export const ControllerPrompt = () => {
  const { t } = useTranslation('app')
  const { getThemeValue } = useThemeValues()
  const { openModal } = useOverlay().modal

  return (
    <Page.Row>
      <CardWrapper
        style={{
          border: `1px solid ${getThemeValue('--status-warning-color')}`,
        }}
      >
        <div className="content">
          <h3>
            <FontAwesomeIcon icon={faWarning} /> {t('migrationRequired')}
          </h3>
          <h4>{t('migrateControllerDescription')}</h4>
          <ButtonRow yMargin>
            <ButtonPrimary
              iconLeft={faChevronCircleRight}
              iconTransform="grow-1"
              text={t('migrateController')}
              onClick={() =>
                openModal({
                  key: 'SetController',
                })
              }
            />
          </ButtonRow>
        </div>
      </CardWrapper>
    </Page.Row>
  )
}
