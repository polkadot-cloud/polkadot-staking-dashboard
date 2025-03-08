// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Title } from 'library/Modal/Title'
import { locales } from 'locales'
import { changeLanguage } from 'locales/util'
import { useTranslation } from 'react-i18next'
import { ButtonModal } from 'ui-buttons'
import { ButtonList, Padding } from 'ui-core/modal'
import { useOverlay } from 'ui-overlay'

export const SelectLanguage = () => {
  const { i18n, t } = useTranslation('modals')
  const { setModalStatus } = useOverlay().modal

  return (
    <>
      <Title title={t('selectLanguage')} />
      <Padding horizontalOnly style={{ marginTop: '1rem' }}>
        <ButtonList>
          {Object.entries(locales).map(([code, { label }], i) => (
            <ButtonModal
              key={`${code}_${i}`}
              selected={i18n.resolvedLanguage === code}
              onClick={() => {
                changeLanguage(code, i18n)
                setModalStatus('closing')
              }}
              text={label}
              label={i18n.resolvedLanguage === code ? t('selected') : undefined}
            />
          ))}
        </ButtonList>
      </Padding>
    </>
  )
}
