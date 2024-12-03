// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  faArrowDownWideShort,
  faFilterCircleXmark,
} from '@fortawesome/free-solid-svg-icons'
import { useFilters } from 'contexts/Filters'
import { usePrompt } from 'contexts/Prompt'
import { useTranslation } from 'react-i18next'
import { ButtonPrimaryInvert, ButtonSecondary } from 'ui-buttons'
import { FilterValidators } from '../FilterValidators'
import { OrderValidators } from '../OrderValidators'

export const FilterHeaders = () => {
  const { t } = useTranslation('library')
  const { openPromptWith } = usePrompt()
  const { resetFilters, getFilters } = useFilters()

  const includes = getFilters('include', 'validators')
  const excludes = getFilters('exclude', 'validators')
  const hasFilters = includes?.length || excludes?.length

  return (
    <div
      style={{
        display: 'flex',
        marginBottom: '1.1rem',
      }}
    >
      <ButtonPrimaryInvert
        text={t('order')}
        marginRight
        iconLeft={faArrowDownWideShort}
        onClick={() => {
          openPromptWith(<OrderValidators />)
        }}
      />
      <ButtonPrimaryInvert
        text={t('filter')}
        marginRight
        iconLeft={faFilterCircleXmark}
        onClick={() => {
          openPromptWith(<FilterValidators />)
        }}
      />
      <ButtonSecondary
        text={t('clear')}
        onClick={() => {
          resetFilters('include', 'validators')
          resetFilters('exclude', 'validators')
        }}
        disabled={!hasFilters}
      />
    </div>
  )
}
