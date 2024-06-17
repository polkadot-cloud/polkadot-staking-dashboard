// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { LoaderWrapper } from './Wrappers';

export const CallToActionLoader = () => (
  <LoaderWrapper
    style={{
      width: '100%',
      height: '3.75rem',
      borderRadius: '2rem',
      opacity: 0.4,
    }}
  />
);
