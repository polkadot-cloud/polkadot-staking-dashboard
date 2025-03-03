// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faGithub } from '@fortawesome/free-brands-svg-icons'
import {
  faExternalLinkAlt,
  faPuzzlePiece,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import LanguageSVG from 'assets/svg/icons/language.svg?react'
import MoonOutlineSVG from 'assets/svg/icons/moon.svg?react'
import SunnyOutlineSVG from 'assets/svg/icons/sun.svg?react'
import { GitHubURl } from 'consts'
import { useTheme } from 'contexts/Themes'
import type { Dispatch, SetStateAction } from 'react'
import { MenuItemButton } from 'ui-core/popover'
import { useOverlay } from 'ui-overlay'

export const MenuPopover = ({
  setOpen,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>
}) => {
  const { mode, toggleTheme } = useTheme()
  const { openModal } = useOverlay().modal

  return (
    <div>
      <MenuItemButton onClick={() => toggleTheme()}>
        <div>
          {mode === 'dark' ? (
            <SunnyOutlineSVG width="1.25em" height="1.25em" />
          ) : (
            <MoonOutlineSVG width="1.1em" height="1.1em" />
          )}
        </div>
        <div>
          <h3>Dark Mode</h3>
        </div>
      </MenuItemButton>
      <MenuItemButton
        onClick={() => {
          setOpen(false)
          openModal({ key: 'Settings' })
        }}
      >
        <div>
          <FontAwesomeIcon icon={faPuzzlePiece} transform="grow-0" />
        </div>
        <div>
          <h3>Plugins</h3>
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
          <h3>Language</h3>
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
