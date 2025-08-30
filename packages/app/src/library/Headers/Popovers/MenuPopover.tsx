// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faGithub } from '@fortawesome/free-brands-svg-icons'
import {
	faDollarSign,
	faExternalLinkAlt,
	faPuzzlePiece,
	faSlidersH,
	faToggleOff,
	faToggleOn,
	faUserPlus,
	faWifi,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useOutsideAlerter } from '@w3ux/hooks'
import { capitalizeFirstLetter } from '@w3ux/utils'
import LanguageSVG from 'assets/icons/language.svg?react'
import MoonOutlineSVG from 'assets/icons/moon.svg?react'
import { GitHubURl } from 'consts'
import { CompulsoryPluginsProduction, PluginsList } from 'consts/plugins'
import { getRelayChainData } from 'consts/util/chains'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useBalances } from 'contexts/Balances'
import { useCurrency } from 'contexts/Currency'
import { useNetwork } from 'contexts/Network'
import { useStaking } from 'contexts/Staking'
import { useTheme } from 'contexts/Themes'
import { useUi } from 'contexts/UI'
import { type Dispatch, type SetStateAction, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { MenuItem, MenuItemButton } from 'ui-core/popover'
import { useOverlay } from 'ui-overlay'

export const MenuPopover = ({
	setOpen,
}: {
	setOpen: Dispatch<SetStateAction<boolean>>
}) => {
	const { network } = useNetwork()
	const { t } = useTranslation()
	const { i18n } = useTranslation()
	const { currency } = useCurrency()
	const { isNominator } = useStaking()
	const { mode, toggleTheme } = useTheme()
	const { openModal } = useOverlay().modal
	const { getPoolMembership } = useBalances()
	const { activeAddress } = useActiveAccounts()
	const { advancedMode, setAdvancedMode } = useUi()

	const { name } = getRelayChainData(network)
	const { membership } = getPoolMembership(activeAddress)
	const popoverRef = useRef<HTMLDivElement>(null)

	const notStaking = !isNominator && !membership
	const showPlugins = CompulsoryPluginsProduction.length < PluginsList.length

	// Close the menu if clicked outside of its container
	useOutsideAlerter(popoverRef, () => {
		setOpen(false)
	}, ['header-settings'])

	return (
		<div ref={popoverRef}>
			<MenuItemButton
				onClick={() => {
					setOpen(false)
					openModal({ key: 'Networks' })
				}}
			>
				<div>
					<FontAwesomeIcon icon={faWifi} transform="shrink-2" />
				</div>
				<div>
					<h3>{t('network', { ns: 'app' })}</h3>
					<div>
						<h4>{capitalizeFirstLetter(name)}</h4>
					</div>
				</div>
			</MenuItemButton>
			<MenuItem>
				<button
					type="button"
					onClick={() => {
						setOpen(false)
						openModal({ key: 'SelectLanguage', size: 'xs' })
					}}
				>
					<div>
						<LanguageSVG width="1.2em" height="1.2em" />
					</div>
					<div>
						<h3>{t('language', { ns: 'app' })}</h3>
					</div>
					<div>
						<div>
							<h4>{i18n.language.toUpperCase()}</h4>
						</div>
					</div>
				</button>
				<button
					type="button"
					onClick={() => {
						setOpen(false)
						openModal({ key: 'SelectCurrency', size: 'xs' })
					}}
				>
					<div>
						<FontAwesomeIcon icon={faDollarSign} transform="shrink-2" />
					</div>
					<div>
						<h3>{t('currency', { ns: 'app' })}</h3>
					</div>
					<div>
						<div>
							<h4>{currency}</h4>
						</div>
					</div>
				</button>
			</MenuItem>
			<MenuItemButton onClick={() => setAdvancedMode(!advancedMode)}>
				<div>
					<FontAwesomeIcon icon={faSlidersH} transform="shrink-2" />
				</div>
				<div>
					<h3>{t('advanced', { ns: 'app' })}</h3>
					<div>
						<FontAwesomeIcon
							icon={advancedMode ? faToggleOn : faToggleOff}
							color={
								advancedMode
									? 'var(--accent-color-primary)'
									: 'var(--text-color-tertiary)'
							}
							transform="grow-8"
						/>
					</div>
				</div>
			</MenuItemButton>
			<MenuItemButton onClick={() => toggleTheme()}>
				<div>
					<MoonOutlineSVG width="1em" height="1em" />
				</div>
				<div>
					<h3>{t('darkMode', { ns: 'app' })}</h3>
					<div>
						<FontAwesomeIcon
							icon={mode === 'dark' ? faToggleOn : faToggleOff}
							color={
								mode === 'dark'
									? 'var(--accent-color-primary)'
									: 'var(--text-color-tertiary)'
							}
							transform="grow-8"
						/>
					</div>
				</div>
			</MenuItemButton>

			<MenuItemButton
				disabled={notStaking}
				onClick={() => {
					setOpen(false)
					openModal({ key: 'Invite', size: 'sm' })
				}}
			>
				<div>
					<FontAwesomeIcon icon={faUserPlus} transform="grow-0" />
				</div>
				<div>
					<h3>{t('share', { ns: 'app' })}</h3>
					{notStaking && <div>{t('notStaking', { ns: 'app' })}</div>}
				</div>
			</MenuItemButton>
			{(showPlugins || !import.meta.env.PROD) && (
				<MenuItemButton
					onClick={() => {
						setOpen(false)
						openModal({ key: 'Plugins' })
					}}
				>
					<div>
						<FontAwesomeIcon icon={faPuzzlePiece} transform="shrink-2" />
					</div>
					<div>
						<h3>{t('plugins', { ns: 'modals' })}</h3>
					</div>
				</MenuItemButton>
			)}
			<MenuItemButton
				onClick={() => {
					setOpen(false)
					window.open(GitHubURl, '_blank')
				}}
			>
				<div>
					<FontAwesomeIcon icon={faGithub} transform="grow-0" />
				</div>
				<div>
					<h3>
						GitHub
						<FontAwesomeIcon icon={faExternalLinkAlt} transform="shrink-6" />
					</h3>
				</div>
			</MenuItemButton>
		</div>
	)
}
