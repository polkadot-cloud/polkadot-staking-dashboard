// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useNetwork } from 'contexts/Network';
import { HeadingWrapper } from '../Wrappers';
import { JoinForm } from './JoinForm';

export const Overview = () => {
  const {
    networkData: {
      brand: { token: Token },
    },
  } = useNetwork();
  return (
    <>
      <div>
        <HeadingWrapper>
          <h4>
            <span className="active">Actively Nominating</span>

            <span>11,234 Members</span>

            <span>
              <Token className="icon" />
              1,2345 Bonded
            </span>
          </h4>
        </HeadingWrapper>
      </div>
      <div>
        <JoinForm />
      </div>
    </>
  );
};
