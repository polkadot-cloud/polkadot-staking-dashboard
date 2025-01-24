// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faBars, faGlobe } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { AnyJson } from '@w3ux/types'
import { useMenu } from 'contexts/Menu'
import { usePlugins } from 'contexts/Plugins'
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
import { useValidators } from '../../../contexts/Validators/ValidatorEntries'
import { useList } from '../../List/context'
import { Blocked } from '../../ListItem/Labels/Blocked'
import { Commission } from '../../ListItem/Labels/Commission'
import { EraStatus } from '../../ListItem/Labels/EraStatus'
import { FavoriteValidator } from '../../ListItem/Labels/FavoriteValidator'
import { Identity } from '../../ListItem/Labels/Identity'
import { Select } from '../../ListItem/Labels/Select'
import { Pulse } from './Pulse'
import { getIdentityDisplay } from './Utils'
import type { ValidatorItemProps } from './types'

export const Default = ({
  validator,
  toggleFavorites,
  showMenu,
  displayFor,
}: ValidatorItemProps) => {
  const { t } = useTranslation('library')
  const { selectActive } = useList()
  const { openMenu, open } = useMenu()
  const { pluginEnabled } = usePlugins()
  const { openModal } = useOverlay().modal
  const { validatorIdentities, validatorSupers } = useValidators()

  const { address, prefs, validatorStatus, totalStake } = validator
  const commission = prefs?.commission ?? null

  // Whether buttons should be styled as outline.
  const outline = displayFor === 'canvas'

  const identity = getIdentityDisplay(
    validatorIdentities[address],
    validatorSupers[address]
  )

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
              <CopyAddress address={address} outline={outline} />
              {toggleFavorites && (
                <FavoriteValidator address={address} outline={outline} />
              )}
              {displayFor === 'default' && showMenu && (
                <HeaderButton>
                  <button type="button" onClick={(ev) => toggleMenu(ev)}>
                    <FontAwesomeIcon icon={faBars} transform="shrink-2" />
                  </button>
                </HeaderButton>
              )}
              {displayFor === 'default' && (
                <Metrics
                  address={address}
                  display={getIdentityDisplay(
                    validatorIdentities[address],
                    validatorSupers[address]
                  )}
                />
              )}
            </HeaderButtonRow>
          </div>
        </div>
        <Separator />
        <div className="row bottom lg">
          <div>
            <Pulse address={address} displayFor={displayFor} />
          </div>
          <div>
            <LabelRow inline>
              <Quartile address={address} />
              <Blocked prefs={prefs} />
              <Commission commission={commission} />
              <ParaValidator address={address} />
            </LabelRow>
            <EraStatus
              address={address}
              status={validatorStatus}
              totalStake={totalStake}
              noMargin
            />
          </div>
        </div>
      </div>
    </Wrapper>
  )
}
