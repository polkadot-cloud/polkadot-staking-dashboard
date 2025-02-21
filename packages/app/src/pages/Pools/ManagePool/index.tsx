// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faChevronCircleRight } from '@fortawesome/free-solid-svg-icons'
import { useHelp } from 'contexts/Help'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useValidators } from 'contexts/Validators/ValidatorEntries'
import { CardWrapper } from 'library/Card/Wrappers'
import { Nominations } from 'library/Nominations'
import { useTranslation } from 'react-i18next'
import { ButtonHelp, ButtonPrimary } from 'ui-buttons'
import { ButtonRow, CardHeader, Page } from 'ui-core/base'
import { useOverlay } from 'ui-overlay'

export const ManagePool = () => {
  const { t } = useTranslation()
  const { openCanvas } = useOverlay().canvas
  const { formatWithPrefs } = useValidators()
  const { isOwner, isNominator, activePoolNominations, activePool } =
    useActivePool()

  const poolNominated = activePoolNominations
    ? formatWithPrefs(activePoolNominations.targets)
    : []

  const isNominating = !!activePoolNominations?.targets?.length
  const nominator = activePool?.addresses?.stash ?? null
  const { state } = activePool?.bondedPool || {}
  const { openHelp } = useHelp()

  const canNominate = isOwner() || isNominator()

  return (
    <Page.Row>
      <CardWrapper>
        {canNominate && !isNominating && state !== 'Destroying' ? (
          <>
            <CardHeader action margin>
              <h3>
                {t('nominations', { ns: 'pages' })}
                <ButtonHelp
                  marginLeft
                  onClick={() => openHelp('Nominations')}
                />
              </h3>
              <ButtonRow>
                <ButtonPrimary
                  size="md"
                  iconLeft={faChevronCircleRight}
                  iconTransform="grow-1"
                  text={t('pools.nominate', { ns: 'pages' })}
                  disabled={!canNominate}
                  onClick={() =>
                    openCanvas({
                      key: 'ManageNominations',
                      scroll: false,
                      options: {
                        bondFor: 'pool',
                        nominator,
                        nominated: poolNominated || [],
                      },
                      size: 'xl',
                    })
                  }
                />
              </ButtonRow>
            </CardHeader>
            <h4>{t('notNominating', { ns: 'app' })}.</h4>
          </>
        ) : (
          <Nominations bondFor="pool" nominator={nominator} />
        )}
      </CardWrapper>
    </Page.Row>
  )
}
