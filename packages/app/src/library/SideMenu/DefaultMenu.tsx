// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCoins, faServer } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import BookSVG from 'assets/icons/book.svg?react'
import CloudSVG from 'assets/icons/cloud.svg?react'
import { useHelp } from 'contexts/Help'
import { useUi } from 'contexts/UI'
import type { UIContextInterface } from 'contexts/UI/types'
import { useTranslation } from 'react-i18next'
import { Page } from 'ui-core/base'
import { Main } from './Main'
import { NavSimple } from './NavSimple'
import { Secondary } from './Secondary'
import { BarIconsWrapper, BarLogoWrapper, Wrapper } from './Wrapper'

export const DefaultMenu = () => {
	const { t } = useTranslation('app')
	const { openHelp } = useHelp()
	const { advancedMode, sideMenuMinimised }: UIContextInterface = useUi()

	return (
		<Page.Side.Default
			open={false}
			minimised={sideMenuMinimised}
			bar={
				!advancedMode ? undefined : (
					<>
						<BarLogoWrapper>
							<CloudSVG />
						</BarLogoWrapper>
						<BarIconsWrapper>
							<section>
								<button type="button" onClick={() => {}} className="active">
									<FontAwesomeIcon icon={faCoins} />
								</button>
							</section>
							<section>
								<button type="button" onClick={() => {}}>
									<FontAwesomeIcon icon={faServer} />
								</button>
							</section>
						</BarIconsWrapper>
					</>
				)
			}
			nav={
				!advancedMode ? (
					<NavSimple />
				) : (
					<Wrapper $minimised={sideMenuMinimised} $advancedMode={advancedMode}>
						<section>
							<h3
								style={{
									color: 'var(--accent-color-primary)',
									margin: '0.75rem 0.75rem 0.75rem 0.25rem',
									paddingBottom: '0.78rem',
									paddingLeft: '0.35rem',
									borderBottom: '1px solid var(--accent-color-primary)',
									fontFamily: 'InterSemiBold, sans-serif',
								}}
							>
								{t('stake', { ns: 'app' })}
							</h3>
							<Main ignoreFirstCategory={true} />
							<div className="inner">
								<Page.Side.Heading
									title={t('support')}
									minimised={sideMenuMinimised}
								/>
								<Secondary
									onClick={() => {
										openHelp(null)
									}}
									name={t('resources')}
									minimised={sideMenuMinimised}
									icon={{
										Svg: BookSVG,
										size: sideMenuMinimised ? '0.95em' : '0.8em',
									}}
								/>
							</div>
						</section>
						<section></section>
					</Wrapper>
				)
			}
		></Page.Side.Default>
	)
}
