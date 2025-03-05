// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faGithub } from '@fortawesome/free-brands-svg-icons'
import {
  faDollarSign,
  faExternalLinkAlt,
  faPuzzlePiece,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useOutsideAlerter } from '@w3ux/hooks'
import LanguageSVG from 'assets/svg/icons/language.svg?react'
import MoonOutlineSVG from 'assets/svg/icons/moon.svg?react'
import { GitHubURl } from 'consts'
import { useTheme } from 'contexts/Themes'
import { useRef, type Dispatch, type SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'
import { Switch } from 'ui-core/input'
import { MenuItemButton } from 'ui-core/popover'
import { useOverlay } from 'ui-overlay'

export const MenuPopover = ({
  setOpen,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>
}) => {
  const { t } = useTranslation()
  const { mode, toggleTheme } = useTheme()
  const { openModal } = useOverlay().modal

  const popoverRef = useRef<HTMLDivElement>(null)

  // Close the menu if clicked outside of its container
  useOutsideAlerter(popoverRef, () => {
    setOpen(false)
  }, ['header-settings'])

  return (
    <div ref={popoverRef}>
      <MenuItemButton onClick={() => toggleTheme()}>
        <div>
          <MoonOutlineSVG width="1.1em" height="1.1em" />
        </div>
        <div>
          <h3>{t('darkMode', { ns: 'app' })}</h3>
          <div>
            <Switch checked={mode === 'dark'} />
          </div>
        </div>
      </MenuItemButton>
      <MenuItemButton
        onClick={() => {
          setOpen(false)
          openModal({ key: 'Plugins' })
        }}
      >
        <div>
          <FontAwesomeIcon icon={faPuzzlePiece} transform="grow-0" />
        </div>
        <div>
          <h3>{t('plugins', { ns: 'modals' })}</h3>
        </div>
      </MenuItemButton>
      <MenuItemButton
        onClick={() => {
          setOpen(false)
          openModal({ key: 'ChooseLanguage' })
        }}
      >
        <div>
          <LanguageSVG width="1.4em" height="1.4em" />
        </div>
        <div>
          <h3>{t('language', { ns: 'app' })}</h3>
        </div>
      </MenuItemButton>
      <MenuItemButton
        onClick={() => {
          setOpen(false)
          openModal({ key: 'SelectCurrency' })
        }}
      >
        <div>
          <FontAwesomeIcon icon={faDollarSign} transform="grow-2" />
        </div>
        <div>
          <h3>{t('currency', { ns: 'app' })}</h3>
        </div>
      </MenuItemButton>
      <MenuItemButton
        onClick={() => {
          setOpen(false)
          window.open(GitHubURl, '_blank')
        }}
      >
        <div>
          <FontAwesomeIcon icon={faGithub} transform="grow-2" />
        </div>
        <div>
          <h3>
            GitHub
            <FontAwesomeIcon icon={faExternalLinkAlt} transform="shrink-4" />
          </h3>
        </div>
      </MenuItemButton>
    </div>
  )
}
