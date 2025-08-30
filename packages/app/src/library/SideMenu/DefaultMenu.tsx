// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

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
import { AdvancedLogoWrapper, Wrapper } from './Wrapper'

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
						<AdvancedLogoWrapper>
							<CloudSVG />
						</AdvancedLogoWrapper>
					</>
				)
			}
			nav={
				!advancedMode ? (
					<NavSimple />
				) : (
					<Wrapper $minimised={sideMenuMinimised} $advancedMode={advancedMode}>
						<section>
							<Main />
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
