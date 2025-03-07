// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { SupportedCurrencies } from 'consts/currencies'
import { useCurrency } from 'contexts/Currency'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonModal } from 'ui-buttons'
import { ButtonList, Padding } from 'ui-core/modal'
import { useOverlay } from 'ui-overlay'
import { Title } from '../../../library/Modal/Title'
import { SearchInput } from './Wrapper'

export const SelectCurrency = () => {
  const { t } = useTranslation('modals')
  const { setModalStatus, setModalResize } = useOverlay().modal
  const { currency, setCurrency } = useCurrency()

  // Search term state
  const [searchTerm, setSearchTerm] = useState<string>('')

  // Handle currency selection
  const handleSelect = (c: string) => {
    setCurrency(c)
    setModalStatus('closing')
  }

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const filteredCurrencies = Object.keys(SupportedCurrencies).filter((c) => {
    const searchTermLower = searchTerm.toLowerCase()
    const currencyName = t(`currencies.${c}.name`).toLowerCase()
    const currencySymbol = SupportedCurrencies[c].symbol.toLowerCase()
    const currencyCode = c.toLowerCase()
    return (
      currencyCode.includes(searchTermLower) ||
      currencyName.includes(searchTermLower) ||
      currencySymbol.includes(searchTermLower)
    )
  })

  useEffect(() => {
    setModalResize()
  }, [searchTerm])

  return (
    <>
      <Title title={t('selectCurrency')} />
      <SearchInput>
        <input
          type="text"
          placeholder={t('searchCurrency')}
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </SearchInput>
      <Padding horizontalOnly>
        <ButtonList forceHeight>
          {filteredCurrencies.length > 0 ? (
            filteredCurrencies.map((c) => (
              <ButtonModal
                key={`select_${c}`}
                selected={currency === c}
                text={`${c} - ${SupportedCurrencies[c].symbol}`}
                label={t(`currencies.${c}.name`)}
                onClick={() => handleSelect(c)}
              />
            ))
          ) : (
            <h4>{t('noCurrenciesFound')}</h4>
          )}
        </ButtonList>
      </Padding>
    </>
  )
}
