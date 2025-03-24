// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { useList } from 'contexts/List'
import { usePlugins } from 'contexts/Plugins'
import { CurrentEraPoints } from 'library/List/EraPointsGraph/CurrentEraPoints'
import { HistoricalEraPoints } from 'library/List/EraPointsGraph/HistoricalEraPoints'
import { getIdentityDisplay } from 'library/List/Utils'
import { CopyAddress } from 'library/ListItem/Labels/CopyAddress'
import { Metrics } from 'library/ListItem/Labels/Metrics'
import { ParaValidator } from 'library/ListItem/Labels/ParaValidator'
import { Quartile } from 'library/ListItem/Labels/Quartile'
import { Wrapper } from 'library/ListItem/Wrappers'
import {
  HeaderButton,
  HeaderButtonRow,
  LabelRow,
  Separator,
} from 'ui-core/list'
import { useValidators } from '../../contexts/Validators/ValidatorEntries'
import { Blocked } from '../ListItem/Labels/Blocked'
import { Commission } from '../ListItem/Labels/Commission'
import { EraStatus } from '../ListItem/Labels/EraStatus'
import { FavoriteValidator } from '../ListItem/Labels/FavoriteValidator'
import { Identity } from '../ListItem/Labels/Identity'
import { Select } from '../ListItem/Labels/Select'
import type { ItemProps } from './types'

export const Item = ({
  validator,
  toggleFavorites,
  displayFor,
  eraPoints,
  removeHandler,
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
            {typeof removeHandler === 'function' && (
              <HeaderButton outline={['modal', 'canvas'].includes(displayFor)}>
                <button
                  type="button"
                  onClick={() => {
                    removeHandler({ selected: [validator] })
                  }}
                >
                  <FontAwesomeIcon icon={faTimes} transform="shrink-1" />
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
              <ParaValidator address={address} />
            </LabelRow>
            <EraStatus address={address} status={validatorStatus} noMargin />
          </div>
        </div>
      </div>
    </Wrapper>
  )
}
