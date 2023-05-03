// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import '@polkadotcloud/core-ui/index.css';
import '@polkadotcloud/react-odometer/index.css';
import { App } from 'App';
import { createRoot } from 'react-dom/client';
import 'styles/index.scss';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');
const root = createRoot(rootElement);

root.render(<App />);
