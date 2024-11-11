// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createRoot } from 'react-dom/client';
import { App } from 'App';

// Network styles.
import 'styles/accents/polkadot-relay.css';
import 'styles/accents/kusama-relay.css';
import 'styles/accents/westend-relay.css';

// App styles.
import 'styles/fonts/font.scss';
import 'styles/theme/theme.scss';
import 'styles/theme/index.scss';

// Library styles.
import 'kits/Structure/index.scss';
import 'kits/Overlay/index.scss';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find the root element');
}
const root = createRoot(rootElement);

root.render(<App />);
