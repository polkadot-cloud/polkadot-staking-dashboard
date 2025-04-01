// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  faChartPie,
  faCoins,
  faHeart,
  faUserEdit,
} from '@fortawesome/free-solid-svg-icons'
import { useUnstaking } from 'hooks/useUnstaking'
import { SelectItems } from 'library/SelectItems'
import { SelectItem } from 'library/SelectItems/Item'
import type { Dispatch, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'
import type { Validator } from 'types'

export const Methods = ({
  setMethod,
  setNominations,
  setFetching,
}: {
  setMethod: Dispatch<SetStateAction<string | null>>
  setNominations: Dispatch<SetStateAction<Validator[]>>
  setFetching: Dispatch<SetStateAction<boolean>>
}) => {
  const { t } = useTranslation('app')
  const { isFastUnstaking } = useUnstaking()

  // accumulate generation methods
  const methods = [
    {
      title: t('optimalSelection'),
      subtitle: t('optimalSelectionSubtitle'),
      icon: faChartPie,
      onClick: () => {
        setMethod('Optimal Selection')
        setNominations([])
        setFetching(true)
      },
    },
    {
      title: t('activeLowCommission'),
      subtitle: t('activeLowCommissionSubtitle'),
      icon: faCoins,
      onClick: () => {
        setMethod('Active Low Commission')
        setNominations([])
        setFetching(true)
      },
    },
    {
      title: t('fromFavorites'),
      subtitle: t('fromFavoritesSubtitle'),
      icon: faHeart,
      onClick: () => {
        setMethod('From Favorites')
        setNominations([])
        setFetching(true)
      },
    },
    {
      title: t('manual_selection'),
      subtitle: t('manualSelectionSubtitle'),
      icon: faUserEdit,
      onClick: () => {
        setMethod('Manual')
        setNominations([])
      },
    },
  ]

  return (
    <SelectItems layout="three-col">
      {methods.map((m, i) => (
        <SelectItem
          key={`gen_method_${i}`}
          title={m.title}
          subtitle={m.subtitle}
          icon={m.icon}
          selected={false}
          onClick={m.onClick}
          disabled={isFastUnstaking}
          includeToggle={false}
          grow={false}
          hoverBorder
          layout="three-col"
        />
      ))}
    </SelectItems>
  )
}
