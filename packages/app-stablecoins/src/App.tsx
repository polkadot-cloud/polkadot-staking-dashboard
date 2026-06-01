// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { I18nextProvider } from 'react-i18next'
import { i18next } from './config/i18n'
import { ThemesProvider } from './contexts/Themes'
import { ThemeValuesProvider } from './contexts/ThemeValues'
import { Providers } from './Providers'

export const App = () => (
	<I18nextProvider i18n={i18next}>
		<ThemesProvider>
			<ThemeValuesProvider>
				<Providers />
			</ThemeValuesProvider>
		</ThemesProvider>
	</I18nextProvider>
)
