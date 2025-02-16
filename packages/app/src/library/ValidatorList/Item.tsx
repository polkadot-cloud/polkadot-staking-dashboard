// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faBars, faGlobe } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { AnyJson } from '@w3ux/types'
import { useList } from 'contexts/List'
import { useMenu } from 'contexts/Menu'
import { usePlugins } from 'contexts/Plugins'
import { CurrentEraPoints } from 'library/List/EraPointsGraph/CurrentEraPoints'
import { HistoricalEraPoints } from 'library/List/EraPointsGraph/HistoricalEraPoints'
import { getIdentityDisplay } from 'library/List/Utils'
import { CopyAddress } from 'library/ListItem/Labels/CopyAddress'
import { Metrics } from 'library/ListItem/Labels/Metrics'
import { ParaValidator } from 'library/ListItem/Labels/ParaValidator'
import { Quartile } from 'library/ListItem/Labels/Quartile'
import { Wrapper } from 'library/ListItem/Wrappers'
import { MenuList } from 'library/Menu/List'
import { useTranslation } from 'react-i18next'
import {
  HeaderButton,
  HeaderButtonRow,
  LabelRow,
  Separator,
} from 'ui-core/list'
import { useOverlay } from 'ui-overlay'
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
}: ItemProps) => {
  const { t } = useTranslation('library')
  const { selectActive } = useList()
  const { openMenu, open } = useMenu()
  const { pluginEnabled } = usePlugins()
  const { openModal } = useOverlay().modal
  const { validatorIdentities, validatorSupers } = useValidators()
  const { address, prefs, validatorStatus } = validator
  const commission = prefs?.commission ?? null

  const identity = getIdentityDisplay(
    validatorIdentities[address],
    validatorSupers[address]
  ).node

  // Configure menu.
  const menuItems: AnyJson[] = []

  if (pluginEnabled('polkawatch')) {
    menuItems.push({
      icon: <FontAwesomeIcon icon={faGlobe} transform="shrink-3" />,
      wrap: null,
      title: `${t('viewDecentralization')}`,
      cb: () => {
        openModal({
          key: 'ValidatorGeo',
          options: {
            address,
            identity,
          },
        })
      },
    })
  }

  // Handler for opening menu.
  const toggleMenu = (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!open) {
      openMenu(ev, <MenuList items={menuItems} />)
    }
  }

  return (
    <Wrapper>
      <div className={`inner ${displayFor}`}>
        <div className="row top">
          {selectActive && <Select item={validator} />}
          <Identity address={address} />
          <div>
            <HeaderButtonRow>
              <CopyAddress address={address} />
              {toggleFavorites && <FavoriteValidator address={address} />}
              {!['modal', 'canvas'].includes(displayFor) && (
                <HeaderButton>
                  <button type="button" onClick={(ev) => toggleMenu(ev)}>
                    <FontAwesomeIcon icon={faBars} transform="shrink-2" />
                  </button>
                </HeaderButton>
              )}
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
