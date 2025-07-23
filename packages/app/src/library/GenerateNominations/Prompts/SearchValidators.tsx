// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { MaxNominations } from 'consts'
import { useNetwork } from 'contexts/Network'
import { useFavoriteValidators } from 'contexts/Validators/FavoriteValidators'
import { emitNotification } from 'global-bus'
import { SearchInput } from 'library/List/SearchInput'
import { Identity } from 'library/ListItem/Labels/Identity'
import { Title } from 'library/Prompt/Title'
import { FooterWrapper, PromptListItem } from 'library/Prompt/Wrappers'
import { fetchSearchValidators } from 'plugin-staking-api'
import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import type { Validator } from 'types'
import { ButtonPrimary } from 'ui-buttons'
import { Checkbox } from 'ui-core/list'
import { SearchList } from 'ui-core/modal'
import type { PromptProps } from '../types'

export const SearchValidators = ({ callback, nominations }: PromptProps) => {
  const { t } = useTranslation('modals')
  const { network } = useNetwork()
  const { favoritesList } = useFavoriteValidators()

  // Store the total number of selected favorites
  const [selected, setSelected] = useState<Validator[]>([])

  // Store the search input value
  const [searchTerm, setSearchTerm] = useState<string>('')

  // Store search results from the staking API
  const [searchResults, setSearchResults] = useState<Validator[]>([])

  // Store loading state for search
  const [isSearching, setIsSearching] = useState<boolean>(false)

  // Debounced search function
  const debouncedSearch = useCallback(
    async (term: string) => {
      if (term.length === 0) {
        setSearchResults([])
        setIsSearching(false)
        return
      }

      setIsSearching(true)
      try {
        const result = await fetchSearchValidators(network, term)
        if (result) {
          // Work around type issue - the function actually returns SearchValidatorsData
          const data = result as unknown as {
            total: number
            validators: {
              address: string
              commission: number
              blocked: boolean
              display: string
              superDisplay: string
            }[]
          }

          const transformedValidators: Validator[] = data.validators.map(
            (validator) => ({
              address: validator.address,
              prefs: {
                commission: validator.commission,
                blocked: validator.blocked,
              },
            })
          )
          setSearchResults(transformedValidators)
        } else {
          setSearchResults([])
        }
      } catch (error) {
        console.error('Error searching validators:', error)
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    },
    [network]
  )

  // Debounce effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      debouncedSearch(searchTerm)
    }, 300) // 300ms debounce delay

    return () => clearTimeout(timeoutId)
  }, [searchTerm, debouncedSearch])

  const addToSelected = (item: Validator) =>
    setSelected([...selected].concat(item))

  const removeFromSelected = (items: Validator[]) =>
    setSelected([...selected].filter((item) => !items.includes(item)))

  const remaining = MaxNominations - nominations.length - selected.length
  const canAdd = remaining > 0

  const handleSearchChange = (e: FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    setSearchTerm(value)
  }

  return (
    <>
      <Title title={'Search Validators'} />
      <div className="padded">
        <h3 className="subheading">Add validators to your nomination list</h3>
        <SearchList.NominationsCounter
          current={nominations.length + selected.length}
          total={MaxNominations}
          remaining={remaining}
        />

        {/* Two Column Layout */}
        <SearchList.Container>
          {/* Left Column - Search and Favorites (2/3 width) */}
          <SearchList.LeftColumn>
            <SearchInput
              value={searchTerm}
              handleChange={handleSearchChange}
              placeholder="Search validators..."
            />

            {/* Search Results Section */}
            {searchTerm.length > 0 && (
              <div>
                <SearchList.SearchHeader>
                  {isSearching
                    ? 'Searching...'
                    : `Search Results (${searchResults.length})`}
                </SearchList.SearchHeader>
                {isSearching ? (
                  <SearchList.Loading message="Loading..." />
                ) : searchResults.length > 0 ? (
                  searchResults.map((validator: Validator, i) => {
                    const inInitial = !!nominations.find(
                      ({ address }) => address === validator.address
                    )
                    const inSelected = selected.includes(validator)
                    const disabled = !canAdd || inInitial

                    return (
                      <PromptListItem
                        key={`search_result_${i}`}
                        className={
                          disabled && inInitial ? 'inactive' : undefined
                        }
                      >
                        <Checkbox
                          checked={inInitial || inSelected}
                          onClick={() => {
                            if (inSelected) {
                              removeFromSelected([validator])
                            } else if (!disabled) {
                              addToSelected(validator)
                            }
                          }}
                        />
                        <Identity address={validator.address} />
                      </PromptListItem>
                    )
                  })
                ) : (
                  <SearchList.NoResults />
                )}
              </div>
            )}

            {/* Favorites Section */}
            {favoritesList && favoritesList.length > 0 && (
              <div>
                <SearchList.SearchHeader>
                  Your Favorites ({favoritesList.length})
                </SearchList.SearchHeader>

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
                      <Identity
                        key={`favorite_${i}`}
                        address={favorite.address}
                      />
                    </PromptListItem>
                  )
                })}
              </div>
            )}
          </SearchList.LeftColumn>

          {/* Right Column - Selected Validators (1/3 width) */}
          <SearchList.RightColumn>
            <SearchList.Header>
              Selected Validators ({selected.length})
            </SearchList.Header>

            {selected.length > 0 ? (
              <SearchList.SelectedList>
                {selected.map((validator: Validator, i) => (
                  <PromptListItem key={`selected_${i}`}>
                    <Checkbox
                      checked={true}
                      onClick={() => {
                        removeFromSelected([validator])
                      }}
                    />
                    <Identity address={validator.address} />
                  </PromptListItem>
                ))}
              </SearchList.SelectedList>
            ) : (
              <SearchList.EmptyState
                message="No validators selected"
                submessage="Search or select from favorites to add validators"
              />
            )}

            {selected.length > 0 && (
              <SearchList.ClearButton onClick={() => setSelected([])}>
                Clear All Selected
              </SearchList.ClearButton>
            )}
          </SearchList.RightColumn>
        </SearchList.Container>

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
