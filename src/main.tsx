// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createRoot } from 'react-dom/client';
import { App } from 'App';

// Network styles.
import 'theme/accents/polkadot-relay.css';
import 'theme/accents/kusama-relay.css';
import 'theme/accents/westend-relay.css';

// App styles.
import 'theme/fonts.scss';
import 'theme/theme.scss';
import 'theme/index.scss';

// Library styles.
import 'kits/Buttons/index.scss';
import 'kits/Structure/index.scss';
import 'kits/Overlay/index.scss';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find the root element');
}
const root = createRoot(rootElement);

root.render(<App />);
