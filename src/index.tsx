// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { createRoot } from 'react-dom/client';
import 'index.css';
import App from 'App';
import reportWebVitals from './reportWebVitals';
import { AppErrorBoundary } from './ErrorsBoundary';

// workaround for supporting react 18 beta types:
// https://blog.logrocket.com/how-to-use-typescript-with-react-18-alpha/
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');
const root = createRoot(rootElement);

root.render(<App />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
