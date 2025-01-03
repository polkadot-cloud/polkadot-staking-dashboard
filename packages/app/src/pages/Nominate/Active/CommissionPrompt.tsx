// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  faChevronCircleRight,
  faWarning,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useBalances } from 'contexts/Balances'
import { useNetwork } from 'contexts/Network'
import { useStaking } from 'contexts/Staking'
import { useTheme } from 'contexts/Themes'
import { useValidators } from 'contexts/Validators/ValidatorEntries'
import { useSyncing } from 'hooks/useSyncing'
import { CardWrapper } from 'library/Card/Wrappers'
import { useTranslation } from 'react-i18next'
import { ButtonPrimary } from 'ui-buttons'
import { useOverlay } from 'ui-overlay'
import { ButtonRow, PageRow } from 'ui-structure'

export const CommissionPrompt = () => {
  const { t } = useTranslation('pages')
  const { mode } = useTheme()
  const { inSetup } = useStaking()
  const { getNominations } = useBalances()
  const { openCanvas } = useOverlay().canvas
  const { formatWithPrefs } = useValidators()
  const { colors } = useNetwork().networkData
  const { activeAccount } = useActiveAccounts()
  const { syncing } = useSyncing(['active-pools'])

  const nominated = formatWithPrefs(getNominations(activeAccount))
  const fullCommissionNominees = nominated.filter(
    (nominee) => nominee.prefs.commission === 100
  )

  if (!fullCommissionNominees.length || inSetup() || syncing) {
    return null
  }

  const annuncementBorderColor = colors.secondary[mode]

  return (
    <PageRow>
      <CardWrapper style={{ border: `1px solid ${annuncementBorderColor}` }}>
        <div className="content">
          <h3>
            <FontAwesomeIcon icon={faWarning} />{' '}
            {t('nominate.fullCommissionValidatorTitle')}
          </h3>
          <h4>{t('nominate.fullCommissionValidatorSubtitle')}</h4>
          <ButtonRow yMargin>
            <ButtonPrimary
              iconLeft={faChevronCircleRight}
              iconTransform="grow-1"
              text={`${t('nominate.manage', { ns: 'pages' })}`}
              onClick={() =>
                openCanvas({
                  key: 'ManageNominations',
                  scroll: false,
                  options: {
                    bondFor: 'nominator',
                    nominator: activeAccount,
                    nominated,
                  },
                  size: 'xl',
                })
              }
            />
          </ButtonRow>
        </div>
      </CardWrapper>
    </PageRow>
  )
}
