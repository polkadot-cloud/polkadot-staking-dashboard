// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import classNames from 'classnames'
import { useList } from 'contexts/List'
import { usePlugins } from 'contexts/Plugins'
import { useValidators } from 'contexts/Validators/ValidatorEntries'
import { CurrentEraPoints } from 'library/List/EraPointsGraph/CurrentEraPoints'
import { HistoricalEraPoints } from 'library/List/EraPointsGraph/HistoricalEraPoints'
import { getIdentityDisplay } from 'library/List/Utils'
import { CopyAddress } from 'library/ListItem/Buttons/CopyAddress'
import { Metrics } from 'library/ListItem/Buttons/Metrics'
import { Remove } from 'library/ListItem/Buttons/Remove'
import { Quartile } from 'library/ListItem/Labels/Quartile'
import { Wrapper } from 'library/ListItem/Wrappers'
import { memo } from 'react'
import type { Validator } from 'types'
import { HeaderButtonRow, LabelRow, Separator } from 'ui-core/list'
import {
  boolEqual,
  arePropsEqual as composePropsEqual,
  deepEqual,
  stringEqual,
} from '../../../../utils/src/props'
import { FavoriteValidator } from '../ListItem/Buttons/FavoriteValidator'
import { Select } from '../ListItem/Buttons/Select'
import { Blocked } from '../ListItem/Labels/Blocked'
import { Commission } from '../ListItem/Labels/Commission'
import { EraStatus } from '../ListItem/Labels/EraStatus'
import { Identity } from '../ListItem/Labels/Identity'
import type { ItemProps } from './types'

const ItemComponent = ({
  validator,
  toggleFavorites,
  displayFor,
  eraPoints,
  onRemove,
}: ItemProps) => {
  const { pluginEnabled } = usePlugins()
  const { selectable, selected } = useList()
  const { validatorIdentities, validatorSupers } = useValidators()
  const { address, prefs, validatorStatus } = validator
  const commission = prefs?.commission ?? null

  const isSelected = !!selected.filter(
    (item) => (item as Validator).address === validator.address
  ).length

  const innerClasses = classNames('inner', {
    [displayFor]: true,
    selected: isSelected,
  })

  return (
    <Wrapper>
      <div className={innerClasses}>
        <div className="row top">
          {selectable && <Select item={validator} />}
          <Identity address={address} />
          <div>
            <HeaderButtonRow>
              <CopyAddress address={address} />
              {toggleFavorites && <FavoriteValidator address={address} />}
              {displayFor === 'default' && (
                <Metrics
                  address={address}
                  display={
                    getIdentityDisplay(
                      validatorIdentities[address],
                      validatorSupers[address]
                    ).node
                  }
                />
              )}
            </HeaderButtonRow>
            {typeof onRemove === 'function' && (
              <Remove
                address={address}
                onRemove={() => onRemove({ selected: [validator] })}
                displayFor={displayFor}
              />
            )}
          </div>
        </div>
        <Separator />
        <div className="row bottom lg">
          <div>
            {pluginEnabled('staking_api') ? (
              <HistoricalEraPoints
                address={address}
                displayFor={displayFor}
                eraPoints={eraPoints}
              />
            ) : (
              <CurrentEraPoints address={address} displayFor={displayFor} />
            )}
          </div>
          <div>
            <LabelRow inline>
              <Quartile address={address} />
              <Blocked prefs={prefs} />
              <Commission commission={commission} />
            </LabelRow>
            <EraStatus address={address} status={validatorStatus} noMargin />
          </div>
        </div>
      </div>
    </Wrapper>
  )
}

// Custom comparison function to prevent unnecessary re-renders
const areValidatorItemPropsEqual = (
  prevProps: ItemProps,
  nextProps: ItemProps
): boolean =>
  composePropsEqual(
    // Validator address
    stringEqual(prevProps.validator.address, nextProps.validator.address),
    // Validator status
    stringEqual(
      prevProps.validator.validatorStatus,
      nextProps.validator.validatorStatus
    ),
    // DisplayFor
    stringEqual(prevProps.displayFor, nextProps.displayFor),
    // ToggleFavorites
    boolEqual(!!prevProps.toggleFavorites, !!nextProps.toggleFavorites),
    // Commission (ensure boolean)
    !!(
      prevProps.validator.prefs?.commission ===
      nextProps.validator.prefs?.commission
    ),
    // Validator preferences (blocked status, etc.)
    deepEqual(prevProps.validator.prefs, nextProps.validator.prefs),
    // Era points
    deepEqual(prevProps.eraPoints, nextProps.eraPoints),
    // onRemove function reference
    !!(prevProps.onRemove === nextProps.onRemove)
  )

export const Item = memo(ItemComponent, areValidatorItemPropsEqual)
Item.displayName = 'ValidatorListItem'
