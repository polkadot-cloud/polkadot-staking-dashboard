// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { useApi } from 'contexts/Api'
import { useValidators } from 'contexts/Validators/ValidatorEntries'
import { CardWrapper } from 'library/Card/Wrappers'
import { ValidatorList } from 'library/ValidatorList'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { OperatorsSupportedNetwork, Validator } from 'types'
import { ButtonSecondary } from 'ui-buttons'
import { Page } from 'ui-core/base'
import { Item } from './Item'
import { ItemsWrapper } from './Wrappers'
import { useOperatorsSections } from './context'

export const Entity = ({ network }: { network: OperatorsSupportedNetwork }) => {
  const { t } = useTranslation('pages')
  const { isReady } = useApi()
  const { getValidators } = useValidators()
  const { setActiveSection, activeItem } = useOperatorsSections()

  const { name, validators: entityAllValidators } = activeItem
  const validators = entityAllValidators[network] ?? []

  // include validators that exist in validator set
  const [operatorValidators, setOperatorValidators] = useState<Validator[]>(
    getValidators().filter((v) => validators.includes(v.address))
  )

  useEffect(() => {
    setOperatorValidators(
      getValidators().filter((v) => validators.includes(v.address))
    )
  }, [getValidators(), network])

  useEffect(() => {
    const newValidators = [...operatorValidators]
    setOperatorValidators(newValidators)
  }, [name, activeItem, network])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.05,
      },
    },
  }

  return (
    <Page.Row>
      <Page.Heading>
        <ButtonSecondary
          text={t('goBack')}
          iconLeft={faChevronLeft}
          iconTransform="shrink-3"
          onClick={() => setActiveSection(0)}
        />
      </Page.Heading>
      <ItemsWrapper variants={container} initial="hidden" animate="show">
        <Item item={activeItem} actionable={false} network={network} />
      </ItemsWrapper>
      <CardWrapper>
        {!isReady ? (
          <div className="item">
            <h3>{t('connecting')}...</h3>
          </div>
        ) : (
          <>
            {operatorValidators.length === 0 && (
              <div className="item">
                <h3>
                  {validators.length
                    ? `${t('fetchingValidators')}...`
                    : t('noValidators')}
                </h3>
              </div>
            )}
            {operatorValidators.length > 0 && (
              <ValidatorList
                bondFor="nominator"
                validators={operatorValidators}
                allowListFormat={false}
                selectable={false}
                allowMoreCols
                itemsPerPage={50}
                toggleFavorites
                allowFilters
              />
            )}
          </>
        )}
      </CardWrapper>
    </Page.Row>
  )
}
