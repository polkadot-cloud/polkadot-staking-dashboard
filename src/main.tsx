// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createRoot } from 'react-dom/client';
import { App } from 'App';

// Network styles.
import '@polkadot-cloud/core/accent/polkadot-relay.css';
import '@polkadot-cloud/core/accent/kusama-relay.css';
import '@polkadot-cloud/core/accent/westend-relay.css';

// App styles.
import 'theme/fonts.css';
import 'theme/theme.css';
import 'theme/index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find the root element');
}
const root = createRoot(rootElement);

root.render(<App />);
