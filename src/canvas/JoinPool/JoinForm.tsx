// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { planckToUnit } from '@w3ux/utils';
import BigNumber from 'bignumber.js';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useHelp } from 'contexts/Help';
import { useNetwork } from 'contexts/Network';
import type { ClaimPermission } from 'contexts/Pools/types';
import { useTransferOptions } from 'contexts/TransferOptions';
import { useTxMeta } from 'contexts/TxMeta';
import { useState } from 'react';
import { JoinFormWrapper } from './Wrappers';
import { ButtonSubmitInvert } from 'kits/Buttons/ButtonSubmitInvert';
import { ButtonHelp } from 'kits/Buttons/ButtonHelp';
import { ClaimPermissionInput } from 'library/Form/ClaimPermissionInput';
import { CallToActionWrapper } from 'library/CallToAction';

export const JoinForm = () => {
  const {
    networkData: { units },
  } = useNetwork();
  const { txFees } = useTxMeta();
  const { openHelp } = useHelp();
  const { activeAccount } = useActiveAccounts();
  const { getTransferOptions } = useTransferOptions();

  const {
    pool: { totalPossibleBond },
    transferrableBalance,
  } = getTransferOptions(activeAccount);

  // Pool claim permission value.
  const [claimPermission, setClaimPermission] = useState<
    ClaimPermission | undefined
  >('PermissionlessWithdraw');

  // Local bond value.
  const [bond] = useState<{ bond: string }>({
    bond: planckToUnit(totalPossibleBond, units).toString(),
  });

  // if we are bonding, subtract tx fees from bond amount
  const freeBondAmount = BigNumber.max(transferrableBalance.minus(txFees), 0);

  return (
    <JoinFormWrapper>
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
    </JoinFormWrapper>
  );
};
