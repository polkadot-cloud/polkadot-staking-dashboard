// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

// Network themes.
import '@polkadot-cloud/core/theme/polkadot-relay/index.css';
import '@polkadot-cloud/core/theme/kusama-relay/index.css';
import '@polkadot-cloud/core/theme/westend-relay/index.css';

// Default template fonts.
import '@polkadot-cloud/core/template/default/fonts/index.css';
// Default template theme.
import '@polkadot-cloud/core/template/default/index.css';

// Polkadot Cloud core styles.
import '@polkadot-cloud/core/css/styles/index.css';

// Miscellaneous component styles.
import '@polkadotcloud/react-odometer/index.css';
import { createRoot } from 'react-dom/client';
import { App } from 'App';

// App font sizes.
import 'styles/index.scss';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');
const root = createRoot(rootElement);

root.render(<App />);
