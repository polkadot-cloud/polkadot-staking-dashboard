// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createRoot } from 'react-dom/client';
import { App } from 'App';

// Network styles.
import '@polkadot-cloud/core/accent/polkadot-relay.css';
import '@polkadot-cloud/core/accent/kusama-relay.css';
import '@polkadot-cloud/core/accent/westend-relay.css';

// App styles.
import 'theme/fonts.scss';
import 'theme/theme.scss';
import 'theme/index.scss';

// Library styles.
import 'library/kits/Buttons/buttons.scss';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find the root element');
}
const root = createRoot(rootElement);

root.render(<App />);
