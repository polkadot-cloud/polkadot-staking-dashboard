// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faGithub } from '@fortawesome/free-brands-svg-icons'
import {
	faCog,
	faDollarSign,
	faExternalLinkAlt,
	faGlobe,
	faMoon,
	faPuzzlePiece,
	faShare,
	faToggleOff,
	faToggleOn,
	faWifi,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useOutsideAlerter } from '@w3ux/hooks'
import { capitalizeFirstLetter } from '@w3ux/utils'
import DiscordSVG from 'assets/brands/discord.svg?react'
import EnvelopeSVG from 'assets/icons/envelope.svg?react'
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

// Section Header component - matching ConnectPopover styling
const SectionHeader = ({
	title,
	isFirst,
}: {
	title: string
	isFirst?: boolean
}) => (
	<h4
		style={{
			background: 'var(--button-popover-tab-background)',
			color: 'var(--text-color-tertiary)',
			fontFamily: 'InterSemiBold, sans-serif',
			overflow: 'hidden',
			padding: '0 0.75rem',
			lineHeight: '3rem',
			margin: '0',
			...(isFirst && {
				borderTopLeftRadius: '0.75rem',
				borderTopRightRadius: '0.75rem',
			}),
		}}
	>
		{title}
	</h4>
)

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
			{/* CORE SETTINGS */}
			<SectionHeader title={t('coreSettings', { ns: 'app' })} isFirst={true} />
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
						<FontAwesomeIcon icon={faGlobe} transform="shrink-2" />
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

			{/* PREFERENCES */}
			<SectionHeader title={t('preferences', { ns: 'app' })} />
			<MenuItemButton onClick={() => setAdvancedMode(!advancedMode)}>
				<div>
					<FontAwesomeIcon icon={faCog} transform="shrink-2" />
				</div>
				<div>
					<h3>
						{t('advanced', { ns: 'app' })} (
						{t('additionalDataTools', { ns: 'app' })})
					</h3>
				</div>
				<div>
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
					<FontAwesomeIcon icon={faMoon} transform="shrink-2" />
				</div>
				<div>
					<h3>{t('darkMode', { ns: 'app' })}</h3>
				</div>
				<div>
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

			{/* SHARING & SUPPORT */}
			<SectionHeader title={t('sharingAndSupport', { ns: 'app' })} />
			<MenuItemButton
				disabled={notStaking}
				onClick={() => {
					setOpen(false)
					openModal({ key: 'Invite', size: 'sm' })
				}}
			>
				<div>
					<FontAwesomeIcon icon={faShare} transform="shrink-2" />
				</div>
				<div>
					<h3>{t('share', { ns: 'app' })}</h3>
					{notStaking && <div>{t('notStaking', { ns: 'app' })}</div>}
				</div>
			</MenuItemButton>
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
					<h3>GitHub</h3>
				</div>
				<div>
					<div>
						<h4>
							<FontAwesomeIcon icon={faExternalLinkAlt} transform="shrink-1" />
						</h4>
					</div>
				</div>
			</MenuItemButton>
			<MenuItemButton
				onClick={() => {
					setOpen(false)
					openModal({ key: 'DiscordSupport', size: 'sm' })
				}}
			>
				<div>
					<DiscordSVG width="1em" height="1.1em" />
				</div>
				<div>
					<h3>Discord</h3>
				</div>
			</MenuItemButton>
			<MenuItemButton
				onClick={() => {
					setOpen(false)
					openModal({ key: 'MailSupport', size: 'sm' })
				}}
			>
				<div>
					<EnvelopeSVG width="1em" height="1em" />
				</div>
				<div>
					<h3>{t('email', { ns: 'app' })}</h3>
				</div>
			</MenuItemButton>
		</div>
	)
}
