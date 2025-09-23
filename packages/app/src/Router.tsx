// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Offline } from 'Offline'
import { Overlays } from 'Overlays'
import { StakingApi } from 'StakingApi'
import { useEffectIgnoreInitial } from '@w3ux/hooks'
import { extractUrlValue } from '@w3ux/utils'
import { getPagesConfig } from 'config/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useNetwork } from 'contexts/Network'
import { usePlugins } from 'contexts/Plugins'
import { useUi } from 'contexts/UI'
import { getUnixTime } from 'date-fns'
import {
	onConversionEvent,
	onNewUserEvent,
	onReturningUserEvent,
} from 'event-tracking'
import { useAccountFromUrl } from 'hooks/useAccountFromUrl'
import { useAccountSwitchNavigation } from 'hooks/useAccountSwitchNavigation'
import { ErrorFallbackApp, ErrorFallbackRoutes } from 'library/ErrorBoundary'
import { Headers } from 'library/Headers'
import { Help } from 'library/Help'
import { MainFooter } from 'library/MainFooter'
import { Menu } from 'library/Menu'
import { NotificationPrompts } from 'library/NotificationPrompts'
import { PageWithTitle } from 'library/PageWithTitle'
import { Prompt } from 'library/Prompt'
import { SideMenu } from 'library/SideMenu'
import { Tooltip } from 'library/Tooltip'
import { ApolloProvider, client } from 'plugin-staking-api'
import { useEffect, useRef } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { HelmetProvider } from 'react-helmet-async'
import {
	HashRouter,
	Navigate,
	Route,
	Routes,
	useLocation,
	useNavigate,
} from 'react-router-dom'
import { Page } from 'ui-core/base'

const RouterInner = () => {
	const navigate = useNavigate()
	const { network } = useNetwork()
	const { pluginEnabled } = usePlugins()
	const { pathname, search } = useLocation()
	const { activeAddress } = useActiveAccounts()
	const { setContainerRefs, advancedMode } = useUi()

	// References to outer container
	const mainInterfaceRef = useRef<HTMLDivElement>(null)

	// Handle returning or new user
	const handleVisit = (utmSource: string | null) => {
		const attributes = utmSource ? { utmSource } : {}
		if (!localStorage.getItem('last_visited')) {
			onNewUserEvent(attributes)
		} else {
			onReturningUserEvent(attributes)
		}
		// Record last visited timestamp to local storage
		localStorage.setItem('last_visited', String(getUnixTime(Date.now())))
	}

	// Scroll to top of the window on every page change or network change
	useEffect(() => {
		window.scrollTo(0, 0)
	}, [pathname, network])

	// Set container references to UI context and make available throughout app
	useEffect(() => {
		setContainerRefs({
			mainInterface: mainInterfaceRef,
		})
	}, [])

	// Support active account from url
	useAccountFromUrl()

	// Handle automatic navigation on account switch based on staking status
	useAccountSwitchNavigation()

	// Jump back to overview page on advanced mode change
	useEffectIgnoreInitial(() => {
		navigate(`/overview`)
	}, [advancedMode])

	// Handle landing source from URL
	useEffect(() => {
		const utmSource = extractUrlValue('utm_source', search)
		if (utmSource) {
			onConversionEvent(`conversion_${utmSource}`)
		}
		handleVisit(utmSource)
	}, [])

	return (
		<ErrorBoundary FallbackComponent={ErrorFallbackApp}>
			<ApolloProvider client={client}>
				{pluginEnabled('staking_api') && activeAddress && (
					<StakingApi who={activeAddress} network={network} />
				)}
				<NotificationPrompts />
				<Page.Body>
					<Help />
					<Overlays />
					<Menu />
					<Tooltip />
					<Prompt />
					<SideMenu />
					<Page.Main ref={mainInterfaceRef}>
						<HelmetProvider>
							<Headers />
							<ErrorBoundary FallbackComponent={ErrorFallbackRoutes}>
								<Routes>
									{getPagesConfig(network, null, advancedMode).map(
										(page, i) => (
											<Route
												key={`main_interface_page_${i}`}
												path={page.hash}
												element={<PageWithTitle page={page} />}
											/>
										),
									)}
									<Route
										key="main_interface_navigate"
										path="*"
										element={<Navigate to="/overview" />}
									/>
								</Routes>
							</ErrorBoundary>
							<MainFooter />
						</HelmetProvider>
					</Page.Main>
				</Page.Body>
				<Offline />
			</ApolloProvider>
		</ErrorBoundary>
	)
}

export const Router = () => (
	<HashRouter basename="/">
		<RouterInner />
	</HashRouter>
)
