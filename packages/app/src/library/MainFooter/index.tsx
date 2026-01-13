// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faHive } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Odometer } from '@w3ux/react-odometer'
import CloudIconSVG from 'assets/icons/cloud.svg?react'
import BigNumber from 'bignumber.js'
import {
	DappOrganisation,
	PlatformDisclaimerURL,
	PlatformPrivacyURL,
	PlatformURL,
} from 'consts'
import { useNetwork } from 'contexts/Network'
import { usePlugins } from 'contexts/Plugins'
import { IGNORE_NETWORKS } from 'contexts/TokenPrice'
import { blockNumber$ } from 'global-bus'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Page } from 'ui-core/base'
import { Status } from './Status'
import { TokenPrice } from './TokenPrice'
import { Summary, Wrapper } from './Wrappers'

export const MainFooter = () => {
	const { t } = useTranslation('app')
	const { plugins } = usePlugins()
	const { network } = useNetwork()

	const [blockNumber, setBlockNumber] = useState<number>()

	useEffect(() => {
		const blockNumberSub = blockNumber$.subscribe((result) => {
			setBlockNumber(result)
		})
		return () => {
			blockNumberSub.unsubscribe()
		}
	}, [])

	return (
		<Page.Footer>
			<Wrapper className="page-padding container-width">
				<CloudIconSVG className="icon" />
				<Summary>
					<section>
						<p>
							<a href={PlatformURL} target="_blank" rel="noreferrer">
								{DappOrganisation}
							</a>
						</p>
						<Status />
						<p>
							<a href={PlatformPrivacyURL} target="_blank" rel="noreferrer">
								{t('privacy')}
							</a>
						</p>
						<p>
							<a href={PlatformDisclaimerURL} target="_blank" rel="noreferrer">
								{t('disclaimer')}
							</a>
						</p>
					</section>
					<section>
						<div className="hide-small">
							{plugins.includes('staking_api') &&
								!IGNORE_NETWORKS.includes(network) && <TokenPrice />}
							{import.meta.env.MODE === 'development' && (
								<div className="stat last">
									<FontAwesomeIcon icon={faHive} />
									<Odometer
										wholeColor="var(--text-color-secondary)"
										value={new BigNumber(blockNumber || '0').toFormat()}
										spaceBefore={'0.35rem'}
									/>
								</div>
							)}
						</div>
					</section>
				</Summary>
			</Wrapper>
		</Page.Footer>
	)
}
