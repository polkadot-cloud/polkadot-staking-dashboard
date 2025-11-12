// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faGithub } from '@fortawesome/free-brands-svg-icons'
import {
	faBookOpen,
	faCog,
	faDollarSign,
	faExternalLinkAlt,
	faGlobe,
	faInfo,
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
import { GitHubURl, StakingDocsUrl } from 'consts'
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
import { DefaultButton } from './DefaultButton'

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
	const { advancedMode, setAdvancedMode, showHelp, setShowHelp } = useUi()

	const { name } = getRelayChainData(network)
	const { membership } = getPoolMembership(activeAddress)
	const popoverRef = useRef<HTMLDivElement>(null)

	const notStaking = !isNominator && !membership

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
			<MenuItemButton onClick={() => setAdvancedMode(!advancedMode)}>
				<div>
					<FontAwesomeIcon icon={faCog} transform="shrink-2" />
				</div>
				<div>
					<h3>{t('advancedMode', { ns: 'app' })}</h3>
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
			<MenuItemButton onClick={() => setShowHelp(!showHelp)}>
				<div>
					<FontAwesomeIcon icon={faInfo} transform="shrink-1" />
				</div>
				<div>
					<h3>{t('helpPrompts', { ns: 'app' })}</h3>
				</div>
				<div>
					<div>
						<FontAwesomeIcon
							icon={showHelp ? faToggleOn : faToggleOff}
							color={
								showHelp
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
			<DefaultButton
				text={t('share', { ns: 'app' })}
				note={notStaking ? t('notStaking', { ns: 'app' }) : undefined}
				disabled={notStaking}
				iconLeft={faShare}
				onClick={() => {
					setOpen(false)
					openModal({ key: 'Invite', size: 'sm' })
				}}
			/>
			{!import.meta.env.PROD && (
				<DefaultButton
					text={t('plugins', { ns: 'modals' })}
					iconLeft={faPuzzlePiece}
					onClick={() => {
						setOpen(false)
						openModal({ key: 'Plugins' })
					}}
				/>
			)}
			<MenuItem>
				<button
					type="button"
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
				</button>
				<button
					type="button"
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
				</button>
			</MenuItem>
			<DefaultButton
				text={t('documentation', { ns: 'app' })}
				iconLeft={faBookOpen}
				iconRight={faExternalLinkAlt}
				onClick={() => {
					setOpen(false)
					window.open(`${StakingDocsUrl}/#/${i18n.language}`, '_blank')
				}}
			/>
			<DefaultButton
				text="GitHub"
				iconLeft={faGithub}
				iconRight={faExternalLinkAlt}
				onClick={() => {
					setOpen(false)
					window.open(GitHubURl, '_blank')
				}}
			/>
		</div>
	)
}
