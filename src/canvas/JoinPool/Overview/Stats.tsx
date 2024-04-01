// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useNetwork } from 'contexts/Network';
import { HeadingWrapper } from '../Wrappers';

export const Stats = () => {
  const {
    networkData: {
      unit,
      brand: { token: Token },
    },
  } = useNetwork();

  return (
    <HeadingWrapper>
      <h4>
        <span className="active">Actively Nominating</span>

        <span>11,234 Members</span>

        <span className="balance">
          <Token className="icon" />
          1,2345 {unit} Bonded
        </span>
      </h4>
    </HeadingWrapper>
  );
};
