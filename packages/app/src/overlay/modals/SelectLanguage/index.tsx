// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Title } from 'library/Modal/Title'
import { displayLocales } from 'locales'
import { changeLanguage } from 'locales/util'
import { useTranslation } from 'react-i18next'
import { ButtonModal } from 'ui-buttons'
import { ButtonList, Padding } from 'ui-core/modal'
import { useOverlay } from 'ui-overlay'

export const SelectLanguage = () => {
  const { i18n, t } = useTranslation('modals')
  const { setModalStatus } = useOverlay().modal
  const browserLang = navigator.language

  // Get the active display language based on current locale and browser language
  const getActiveDisplayLanguage = () => {
    const currentLng = i18n.resolvedLanguage

    // If current language is a suffix-based variant, return that display language
    if (
      currentLng === 'en' &&
      browserLang === 'en-GB' &&
      localStorage.getItem('browserLang') === 'en-GB'
    ) {
      return 'en-GB'
    }

    return currentLng
  }

  const activeDisplayLanguage = getActiveDisplayLanguage()

  return (
    <>
      <Title title={t('selectLanguage')} />
      <Padding horizontalOnly style={{ marginTop: '1rem' }}>
        <ButtonList>
          {Object.entries(displayLocales).map(([code, { label }], i) => {
            const isSelected = activeDisplayLanguage === code

            // Handle the actual locale code to change to (may differ from display code)
            const localeToChangeTo = code.includes('-')
              ? code.split('-')[0] // For variants like 'en-GB', use the base locale ('en')
              : code

            return (
              <ButtonModal
                key={`${code}_${i}`}
                selected={isSelected}
                onClick={() => {
                  // For variants, store the browser language for suffix handling
                  if (code.includes('-')) {
                    localStorage.setItem('browserLang', code)
                  }

                  changeLanguage(localeToChangeTo, i18n)
                  setModalStatus('closing')
                }}
                text={label}
                label={isSelected ? t('selected') : undefined}
              />
            )
          })}
        </ButtonList>
      </Padding>
    </>
  )
}
