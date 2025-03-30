// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { useList } from 'contexts/List'
import { usePlugins } from 'contexts/Plugins'
import { useValidators } from 'contexts/Validators/ValidatorEntries'
import { CurrentEraPoints } from 'library/List/EraPointsGraph/CurrentEraPoints'
import { HistoricalEraPoints } from 'library/List/EraPointsGraph/HistoricalEraPoints'
import { getIdentityDisplay } from 'library/List/Utils'
import { CopyAddress } from 'library/ListItem/Buttons/CopyAddress'
import { Metrics } from 'library/ListItem/Buttons/Metrics'
import { ParaValidator } from 'library/ListItem/Labels/ParaValidator'
import { Quartile } from 'library/ListItem/Labels/Quartile'
import { Wrapper } from 'library/ListItem/Wrappers'
import {
  HeaderButton,
  HeaderButtonRow,
  LabelRow,
  Separator,
} from 'ui-core/list'
import { Favorite } from '../ListItem/Buttons/Favorite'
import { Select } from '../ListItem/Buttons/Select'
import { Blocked } from '../ListItem/Labels/Blocked'
import { Commission } from '../ListItem/Labels/Commission'
import { EraStatus } from '../ListItem/Labels/EraStatus'
import { Identity } from '../ListItem/Labels/Identity'
import type { ItemProps } from './types'

export const Item = ({
  validator,
  toggleFavorites,
  displayFor,
  eraPoints,
  onRemove,
  showParaValidator,
}: ItemProps) => {
  const { pluginEnabled } = usePlugins()
  const { selectable, selected } = useList()
  const { validatorIdentities, validatorSupers } = useValidators()
  const { address, prefs, validatorStatus } = validator
  const commission = prefs?.commission ?? null

  const isSelected = !!selected.filter(
    (item) => item.address === validator.address
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
              {toggleFavorites && <Favorite address={address} />}
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
              <HeaderButton
                outline={['modal', 'canvas'].includes(displayFor)}
                noMargin
              >
                <button
                  type="button"
                  onClick={() => {
                    onRemove({ selected: [validator] })
                  }}
                >
                  <FontAwesomeIcon icon={faXmark} transform="grow-4" />
                </button>
              </HeaderButton>
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
              {showParaValidator && <ParaValidator address={address} />}
            </LabelRow>
            <EraStatus address={address} status={validatorStatus} noMargin />
          </div>
        </div>
      </div>
    </Wrapper>
  )
}
