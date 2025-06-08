// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { MaxNominations } from 'consts'
import { useFavoriteValidators } from 'contexts/Validators/FavoriteValidators'
import { emitNotification } from 'global-bus'
import { Identity } from 'library/ListItem/Labels/Identity'
import { Title } from 'library/Prompt/Title'
import { FooterWrapper, PromptListItem } from 'library/Prompt/Wrappers'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Validator } from 'types'
import { ButtonPrimary } from 'ui-buttons'
import { Checkbox } from 'ui-core/list'
import type { PromptProps } from '../types'

export const SearchValidators = ({ callback, nominations }: PromptProps) => {
  const { t } = useTranslation('modals')
  const { favoritesList } = useFavoriteValidators()

  // Store the total number of selected favorites
  const [selected, setSelected] = useState<Validator[]>([])

  const addToSelected = (item: Validator) =>
    setSelected([...selected].concat(item))

  const removeFromSelected = (items: Validator[]) =>
    setSelected([...selected].filter((item) => !items.includes(item)))

  const remaining = MaxNominations - nominations.length - selected.length
  const canAdd = remaining > 0

  return (
    <>
      <Title title={'Search Validators'} />
      <div className="padded">
        <h4 className="subheading">Add validators to your nomination list.</h4>

        {favoritesList?.map((favorite: Validator, i) => {
          const inInitial = !!nominations.find(
            ({ address }) => address === favorite.address
          )
          const disabled = !canAdd || inInitial

          return (
            <PromptListItem
              key={`favorite_${i}`}
              className={disabled && inInitial ? 'inactive' : undefined}
            >
              <Checkbox
                checked={inInitial || selected.includes(favorite)}
                onClick={() => {
                  if (selected.includes(favorite)) {
                    removeFromSelected([favorite])
                  } else {
                    addToSelected(favorite)
                  }
                }}
              />
              <Identity key={`favorite_${i}`} address={favorite.address} />
            </PromptListItem>
          )
        })}
        <FooterWrapper>
          <ButtonPrimary
            text={t('addToNominations')}
            onClick={() => {
              callback(nominations.concat(selected))
              emitNotification({
                title: t('favoritesAddedTitle', { count: selected.length }),
                subtitle: t('favoritesAddedSubtitle', {
                  count: selected.length,
                }),
              })
            }}
            disabled={selected.length === 0}
          />
        </FooterWrapper>
      </div>
    </>
  )
}
