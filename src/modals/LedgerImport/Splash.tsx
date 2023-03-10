// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ReactComponent as LogoSVG } from 'img/ledgerLogo.svg';
import type { SplashProps } from './types';
import { determineStatusFromCodes } from './Utils';
import { SplashWrapper } from './Wrappers';

export const Splash = ({ statusCodes }: SplashProps) => (
  <SplashWrapper>
    <div className="icon">
      <LogoSVG style={{ transform: 'scale(0.7)' }} opacity={0.25} />
    </div>

    <div className="content">
      <h1>
        {!statusCodes.length
          ? 'Checking...'
          : determineStatusFromCodes(statusCodes, false).title}
      </h1>
      <h5>{determineStatusFromCodes(statusCodes, false).subtitle}</h5>
    </div>
  </SplashWrapper>
);
