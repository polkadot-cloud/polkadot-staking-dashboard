// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faArrowsRotate, faTimes } from '@fortawesome/free-solid-svg-icons';
import { CanvasFullScreenWrapper } from 'canvas/Wrappers';
import { ButtonPrimary } from 'kits/Buttons/ButtonPrimary';
import { ButtonPrimaryInvert } from 'kits/Buttons/ButtonPrimaryInvert';
import { useOverlay } from 'kits/Overlay/Provider';
import { useTranslation } from 'react-i18next';
import { JoinPoolInterfaceWrapper, TokenInputCardWrapper } from './Wrappers';
import { ButtonSubmitInvert } from 'kits/Buttons/ButtonSubmitInvert';
import { ClaimPermissionInput } from 'library/Form/ClaimPermissionInput';
import type { ClaimPermission } from 'contexts/Pools/types';
import { useState } from 'react';
import BigNumber from 'bignumber.js';
import { useTransferOptions } from 'contexts/TransferOptions';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useTxMeta } from 'contexts/TxMeta';
import { planckToUnit } from '@w3ux/utils';
import { useNetwork } from 'contexts/Network';
import { CallToActionWrapper } from 'library/CallToAction';
import { ButtonHelp } from 'kits/Buttons/ButtonHelp';
import { useHelp } from 'contexts/Help';

export const JoinPool = () => {
  const { t } = useTranslation();
  const {
    networkData: { units },
  } = useNetwork();
  const { txFees } = useTxMeta();
  const { openHelp } = useHelp();
  const { closeCanvas } = useOverlay().canvas;
  const { activeAccount } = useActiveAccounts();
  const { getTransferOptions } = useTransferOptions();

  const {
    pool: { totalPossibleBond },
    transferrableBalance,
  } = getTransferOptions(activeAccount);

  // if we are bonding, subtract tx fees from bond amount
  const freeBondAmount = BigNumber.max(transferrableBalance.minus(txFees), 0);

  // Pool claim permission value.
  const [claimPermission, setClaimPermission] = useState<
    ClaimPermission | undefined
  >('PermissionlessWithdraw');

  // Local bond value.
  const [bond] = useState<{ bond: string }>({
    bond: planckToUnit(totalPossibleBond, units).toString(),
  });

  // Jandler to set bond as a string.
  // const handleSetBond = (newBond: { bond: BigNumber }) => {
  //   setBond({ bond: newBond.bond.toString() });
  // };

  return (
    <CanvasFullScreenWrapper>
      <div className="head">
        <ButtonPrimaryInvert
          text={'Change Pool'}
          iconLeft={faArrowsRotate}
          onClick={() => {
            /* TODO: implement */
          }}
          lg
        />
        <ButtonPrimary
          text={t('cancel', { ns: 'library' })}
          lg
          onClick={() => closeCanvas()}
          iconLeft={faTimes}
          style={{ marginLeft: '1.1rem' }}
        />
      </div>
      <JoinPoolInterfaceWrapper>
        <div className="header">Pool Title</div>
        <div className="content">
          <div>Main content</div>
          <div>
            <TokenInputCardWrapper>
              <h2>Join Pool</h2>
              <h4>Bond DOT</h4>

              <div className="input">
                <div>
                  <h2>{bond.bond}.00</h2>
                </div>
                <div>
                  <ButtonSubmitInvert text="Max" />
                </div>
              </div>

              <div className="note available">
                <h4>You have 0.5 DOT available to bond.</h4>
              </div>

              <h4 className="underline">
                Claim Setting
                <ButtonHelp
                  marginLeft
                  onClick={() => openHelp('Permissionless Claiming')}
                />
              </h4>

              <ClaimPermissionInput
                current={claimPermission}
                onChange={(val: ClaimPermission | undefined) => {
                  setClaimPermission(val);
                }}
                disabled={!freeBondAmount.isZero()}
              />

              <div className="submit">
                <CallToActionWrapper>
                  <div className="inner">
                    <section className="standalone">
                      <div className="buttons">
                        <div className="button primary standalone">
                          <button
                            style={{ fontSize: '1.3rem' }}
                            onClick={() => {
                              /* TODO: Join pool */
                            }}
                            disabled={false}
                          >
                            Join Pool
                          </button>
                        </div>
                      </div>
                    </section>
                  </div>
                </CallToActionWrapper>
              </div>
            </TokenInputCardWrapper>
          </div>
        </div>
      </JoinPoolInterfaceWrapper>
    </CanvasFullScreenWrapper>
  );
};
