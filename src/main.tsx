// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

// Network classes.
import '@polkadotcloud/themes/theme/polkadot-relay/index.css';
import '@polkadotcloud/themes/theme/kusama-relay/index.css';
import '@polkadotcloud/themes/theme/westend-relay/index.css';

// Fonts with light and dark themes.
import '@polkadotcloud/themes/template/default/fonts/index.css';
import '@polkadotcloud/themes/template/default/index.css';

// Core UI styles.
import '@polkadotcloud/core-ui/index.css';

// Miscellaneous component styles.
import '@polkadotcloud/react-odometer/index.css';
import { createRoot } from 'react-dom/client';
import { App } from 'App';
import 'styles/index.scss';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');
const root = createRoot(rootElement);

root.render(<App />);
