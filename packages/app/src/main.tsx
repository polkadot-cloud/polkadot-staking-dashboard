// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createRoot } from 'react-dom/client';
import { App } from 'App';
import { version } from '../package.json';

// Network styles.
import 'styles/accents/polkadot-relay.css';
import 'styles/accents/kusama-relay.css';
import 'styles/accents/westend-relay.css';

// App styles.
import 'styles/fonts/font.scss';
import 'styles/theme/theme.scss';
import 'styles/theme/index.scss';

// Library styles.
import 'kits/Overlay/index.scss';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find the root element');
}

// Refresh local storage language resources if in development, or if new app version is present.
// This ensures all language keys are up to date.
if (
  localStorage.getItem('app_version') !== version ||
  import.meta.env.MODE === 'development'
) {
  localStorage.removeItem('lng_resources');
}

const root = createRoot(rootElement);

root.render(<App />);
