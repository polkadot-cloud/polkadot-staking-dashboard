// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { HeadingWrapper } from '../Wrappers';
import { JoinForm } from './JoinForm';

export const Overview = () => (
  <>
    <div>
      <HeadingWrapper>
        <h3>Active</h3>
      </HeadingWrapper>
    </div>
    <div>
      <JoinForm />
    </div>
  </>
);
