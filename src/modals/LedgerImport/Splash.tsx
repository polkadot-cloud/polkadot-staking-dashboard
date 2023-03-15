// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ButtonSecondary } from '@polkadotcloud/dashboard-ui';
import { useLedgerHardware } from 'contexts/Hardware/Ledger';
import { ReactComponent as LogoSVG } from 'img/ledgerLogo.svg';
import { Title } from 'library/Modal/Title';
import type { AnyFunction } from 'types';
import { determineStatusFromCodes } from './Utils';
import { SplashWrapper } from './Wrappers';

export const Splash = ({ checkDevicePaired }: AnyFunction) => {
  const { getStatusCodes, isPaired } = useLedgerHardware();
  const statusCodes = getStatusCodes();

  return (
    <>
      <Title title="" />
      <SplashWrapper>
        <div className="icon">
          <LogoSVG style={{ transform: 'scale(0.6)' }} opacity={0.05} />
        </div>

        <div className="content">
          <h2>
            {isPaired !== 'paired'
              ? 'No Device Connected'
              : !statusCodes.length
              ? 'Checking...'
              : determineStatusFromCodes(statusCodes, false).title}
          </h2>
          {isPaired !== 'paired' ? (
            <>
              <h5>Connect your Ledger device to continue.</h5>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <ButtonSecondary
                  text="Try Again"
                  onClick={() => checkDevicePaired()}
                  lg
                />
              </div>
            </>
          ) : null}
          <h5>
            {isPaired === 'paired'
              ? determineStatusFromCodes(statusCodes, false).subtitle
              : null}
          </h5>
        </div>
      </SplashWrapper>
    </>
  );
};
