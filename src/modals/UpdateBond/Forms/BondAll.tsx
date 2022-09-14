// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { useState, useEffect } from 'react';
import { useModal } from 'contexts/Modal';
import { useBalances } from 'contexts/Balances';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { Warning } from 'library/Form/Warning';
import { useActivePool } from 'contexts/Pools/ActivePool';
import { TransferOptions } from 'contexts/Balances/types';
import { planckBnToUnit } from 'Utils';
import { EstimatedTxFee } from 'library/EstimatedTxFee';
import { useTxFees } from 'contexts/TxFees';
import { defaultThemes } from 'theme/default';
import { useTheme } from 'contexts/Themes';
import { BN_ZERO } from '@polkadot/util';
import { Separator, NotesWrapper } from '../../Wrappers';
import { FormFooter } from './FormFooter';
import { FormsProps } from '../types';

export const BondAll = (props: FormsProps) => {
  const { setSection } = props;

  const { mode } = useTheme();
  const { api, network } = useApi();
  const { units } = network;
  const { setStatus: setModalStatus, setResize, config } = useModal();
  const { activeAccount, accountHasSigner } = useConnect();
  const { getTransferOptions } = useBalances();
  const { bondType } = config;
  const { getPoolTransferOptions } = useActivePool();
  const { txFees } = useTxFees();

  const stakeTransferOptions: TransferOptions =
    getTransferOptions(activeAccount);
  const poolTransferOptions = getPoolTransferOptions(activeAccount);
  const isStaking = bondType === 'stake';
  const isPooling = bondType === 'pool';

  const { freeBalance: freeBalanceBn } = isPooling
    ? poolTransferOptions
    : stakeTransferOptions;
  const { totalPossibleBond: totalPossibleBondBn } = isPooling
    ? poolTransferOptions
    : stakeTransferOptions;

  // convert BN values to number
  const freeBalance = planckBnToUnit(freeBalanceBn, units);

  // local bond value
  const [bond, setBond] = useState({ bond: freeBalance });

  // bond minus tx fees
  const bondAfterTxFees = BN.max(freeBalanceBn.sub(txFees), BN_ZERO);

  // total possible bond after tx fees
  const totalPossibleBond = planckBnToUnit(
    BN.max(totalPossibleBondBn.sub(txFees), BN_ZERO),
    units
  );

  // bond valid
  const [bondValid, setBondValid] = useState(false);

  // update bond value on task change
  useEffect(() => {
    const _bond = freeBalance;
    setBond({ bond: _bond });
    if (_bond > 0 && bondAfterTxFees.gt(BN_ZERO)) {
      setBondValid(true);
    } else {
      setBondValid(false);
    }
  }, [freeBalance, txFees]);

  // modal resize on form update
  useEffect(() => {
    setResize();
  }, [bond]);

  // tx to submit
  const tx = () => {
    let _tx = null;
    if (!bondValid || !api || !activeAccount) {
      return _tx;
    }

    // convert to submittable string
    const bondToSubmit = bondAfterTxFees.toString();

    // determine _tx
    if (isPooling) {
      _tx = api.tx.nominationPools.bondExtra({ FreeBalance: bondToSubmit });
    } else if (isStaking) {
      _tx = api.tx.staking.bondExtra(bondToSubmit);
    }
    return _tx;
  };

  const { submitTx, submitting } = useSubmitExtrinsic({
    tx: tx(),
    from: activeAccount,
    shouldSubmit: bondValid,
    callbackSubmit: () => {
      setModalStatus(0);
    },
    callbackInBlock: () => {},
  });

  return (
    <>
      <div className="items">
        <>
          {!accountHasSigner(activeAccount) && (
            <Warning text="Your account is read only, and cannot sign transactions." />
          )}
          {freeBalance === 0 && (
            <Warning text={`You have no free ${network.unit} to bond.`} />
          )}
          <h4>Amount to bond:</h4>
          <h2>
            {planckBnToUnit(bondAfterTxFees, units)} {network.unit}
          </h2>
          <p>
            This amount of {network.unit} will be added to your current bonded
            funds.
          </p>
          <Separator />
          <h4>New total bond:</h4>
          <h2>
            {totalPossibleBond} {network.unit}
          </h2>
          <NotesWrapper>
            {txFees.gt(BN_ZERO) && (
              <p style={{ color: defaultThemes.text.warning[mode] }}>
                Transaction fees have been deducted from your total bond amount.
              </p>
            )}
            <EstimatedTxFee />
          </NotesWrapper>
        </>
      </div>
      <FormFooter
        setSection={setSection}
        submitTx={submitTx}
        submitting={submitting}
        isValid={
          bondValid && accountHasSigner(activeAccount) && !txFees.isZero()
        }
      />
    </>
  );
};
