// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { App } from 'App'
import { createRoot } from 'react-dom/client'
import { version } from '../package.json'

// Network styles
import 'styles/accents/kusama.scss'
import 'styles/accents/polkadot.scss'
import 'styles/accents/westend.scss'

// App styles
import 'styles/fonts/font.scss'
import 'styles/theme/index.scss'
import 'styles/theme/theme.scss'

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Failed to find the root element')
}

// Refresh local storage language resources if in development, or if new app version is present.
// This ensures all language keys are up to date
if (
  localStorage.getItem('app_version') !== version ||
  import.meta.env.MODE === 'development'
) {
  localStorage.removeItem('lng_resources')
}

const root = createRoot(rootElement)

root.render(<App />)
