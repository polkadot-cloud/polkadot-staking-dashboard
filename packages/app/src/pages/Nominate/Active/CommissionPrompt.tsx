// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  faChevronCircleRight,
  faWarning,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useBalances } from 'contexts/Balances'
import { useStaking } from 'contexts/Staking'
import { useThemeValues } from 'contexts/ThemeValues'
import { useValidators } from 'contexts/Validators/ValidatorEntries'
import { useSyncing } from 'hooks/useSyncing'
import { CardWrapper } from 'library/Card/Wrappers'
import { useTranslation } from 'react-i18next'
import { ButtonPrimary } from 'ui-buttons'
import { ButtonRow, Page } from 'ui-core/base'
import { useOverlay } from 'ui-overlay'

export const CommissionPrompt = () => {
  const { t } = useTranslation('pages')
  const { inSetup } = useStaking()
  const { getNominations } = useBalances()
  const { openCanvas } = useOverlay().canvas
  const { getThemeValue } = useThemeValues()
  const { formatWithPrefs } = useValidators()
  const { activeAccount } = useActiveAccounts()
  const { syncing } = useSyncing(['active-pools'])

  const nominated = formatWithPrefs(getNominations(activeAccount))
  const fullCommissionNominees = nominated.filter(
    (nominee) => nominee.prefs.commission === 100
  )

  if (!fullCommissionNominees.length || inSetup() || syncing) {
    return null
  }

  const annuncementBorderColor = getThemeValue('--accent-color-secondary')

  return (
    <Page.Row>
      <CardWrapper style={{ border: `1px solid ${annuncementBorderColor}` }}>
        <div className="content">
          <h3>
            <FontAwesomeIcon icon={faWarning} />{' '}
            {t('fullCommissionValidatorTitle')}
          </h3>
          <h4>{t('fullCommissionValidatorSubtitle')}</h4>
          <ButtonRow yMargin>
            <ButtonPrimary
              iconLeft={faChevronCircleRight}
              iconTransform="grow-1"
              text={`${t('manage', { ns: 'pages' })}`}
              onClick={() =>
                openCanvas({
                  key: 'ManageNominations',
                  scroll: false,
                  options: {
                    bondFor: 'nominator',
                    nominator: activeAccount,
                    nominated,
                  },
                })
              }
            />
          </ButtonRow>
        </div>
      </CardWrapper>
    </Page.Row>
  )
}
