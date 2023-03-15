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
  const { statusCodes, isPaired } = useLedgerHardware();

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
              : statusCodes.length
              ? 'Checking...'
              : determineStatusFromCodes(statusCodes, false).title}
          </h2>
          {isPaired === 'unpaired' ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '1.5rem',
              }}
            >
              <ButtonSecondary
                text="Try Again"
                onClick={() => checkDevicePaired()}
                lg
              />
            </div>
          ) : (
            <h5>{determineStatusFromCodes(statusCodes, false).subtitle}</h5>
          )}
        </div>
      </SplashWrapper>
    </>
  );
};
