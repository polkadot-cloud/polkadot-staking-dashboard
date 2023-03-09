// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import '@rossbulat/polkadot-dashboard-ui/index.css';
import { App } from 'App';
import { createRoot } from 'react-dom/client';
import { Buffer } from "buffer";
import 'styles/index.scss';

window.Buffer = Buffer;

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');
const root = createRoot(rootElement);

root.render(<App />);
