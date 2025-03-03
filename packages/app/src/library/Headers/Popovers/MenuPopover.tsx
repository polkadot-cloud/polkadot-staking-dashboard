// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { faPuzzlePiece } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import LanguageSVG from 'assets/svg/icons/language.svg?react'
import MoonOutlineSVG from 'assets/svg/icons/moon.svg?react'
import SunnyOutlineSVG from 'assets/svg/icons/sun.svg?react'
import { GitHubURl } from 'consts'
import { useTheme } from 'contexts/Themes'
import { MenuItemButton } from 'ui-core/popover'
import { useOverlay } from 'ui-overlay'

export const MenuPopover = () => {
  const { mode, toggleTheme } = useTheme()
  const { openModal } = useOverlay().modal

  return (
    <div>
      <MenuItemButton onClick={() => toggleTheme()}>
        <div>
          <h3>Theme</h3>
        </div>
        <div>
          {mode === 'dark' ? (
            <SunnyOutlineSVG width="1.25em" height="1.25em" />
          ) : (
            <MoonOutlineSVG width="1.1em" height="1.1em" />
          )}
        </div>
      </MenuItemButton>
      <MenuItemButton
        onClick={() => {
          openModal({ key: 'ChooseLanguage' })
        }}
      >
        <div>
          <h3>Language</h3>
        </div>
        <div>
          <LanguageSVG
            width="1.65em"
            height="1.65em"
            style={{ position: 'relative', right: '-0.25rem' }}
          />
        </div>
      </MenuItemButton>
      <MenuItemButton
        onClick={() => {
          openModal({ key: 'Settings' })
        }}
      >
        <div>
          <h3>Plugins</h3>
        </div>
        <div>
          <FontAwesomeIcon icon={faPuzzlePiece} transform="grow-3" />
        </div>
      </MenuItemButton>
      <MenuItemButton
        onClick={() => {
          window.open(GitHubURl, '_blank')
        }}
      >
        <div>
          <h3>GitHub</h3>
        </div>
        <div>
          <FontAwesomeIcon icon={faGithub} transform="grow-5" />
        </div>
      </MenuItemButton>
    </div>
  )
}
