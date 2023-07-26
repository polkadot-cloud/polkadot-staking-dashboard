// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Network classes.
import '@polkadotcloud/themes/chain/polkadot-relay/index.css';
import '@polkadotcloud/themes/chain/kusama-relay/index.css';
import '@polkadotcloud/themes/chain/westend-relay/index.css';

// Fonts with light and dark themes.
import '@polkadotcloud/themes/theme/default/fonts/index.css';
import '@polkadotcloud/themes/theme/default/index.css';

// Core UI styles.
import '@polkadotcloud/core-ui/index.css';

// Miscellaneous component styles.
import '@polkadotcloud/react-odometer/index.css';
import { App } from 'App';
import { createRoot } from 'react-dom/client';
import 'styles/index.scss';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');
const root = createRoot(rootElement);

root.render(<App />);
