// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import LanguageSVG from 'assets/svg/icons/language.svg?react'
import { Title } from 'library/Modal/Title'
import { changeLanguage, locales } from 'locales'
import { useTranslation } from 'react-i18next'
import { Padding } from 'ui-core/modal'
import { useOverlay } from 'ui-overlay'
import { ContentWrapper, LocaleButton } from './Wrapper'

export const ChooseLanguage = () => {
  const { i18n, t } = useTranslation('modals')
  const { setModalStatus } = useOverlay().modal

  return (
    <>
      <Title title={t('chooseLanguage')} Svg={LanguageSVG} />
      <Padding>
        <ContentWrapper>
          <div className="item">
            {Object.entries(locales).map(([code, { label }], i) => (
              <h3 key={`${code}_${i}`}>
                <LocaleButton
                  $connected={i18n.resolvedLanguage === code}
                  type="button"
                  onClick={() => {
                    changeLanguage(code, i18n)
                    setModalStatus('closing')
                  }}
                >
                  {label}
                  {i18n.resolvedLanguage === code && (
                    <h4 className="selected">{t('selected')}</h4>
                  )}
                </LocaleButton>
              </h3>
            ))}
          </div>
        </ContentWrapper>
      </Padding>
    </>
  )
}
