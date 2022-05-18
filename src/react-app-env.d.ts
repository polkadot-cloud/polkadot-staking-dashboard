// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

/// <reference types="react-scripts" />
declare module 'react-dom/client'
declare module 'che-react-number-easing';
declare module 'faler';

declare module 'worker-loader!*' {
  // You need to change `Worker`, if you specified a different value for the `workerType` option
  class WebpackWorker extends Worker {
    constructor ();
  }

  // Uncomment this if you set the `esModule` option to `false`
  // export = WebpackWorker;
  export default WebpackWorker;
}
