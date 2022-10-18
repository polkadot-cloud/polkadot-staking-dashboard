// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BN_ZERO } from '@polkadot/util';
import BN from 'bn.js';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useTheme } from 'contexts/Themes';
import { useTransferOptions } from 'contexts/TransferOptions';
import { useTxFees } from 'contexts/TxFees';
import { EstimatedTxFee } from 'library/EstimatedTxFee';
import { Warning } from 'library/Form/Warning';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { useEffect, useState } from 'react';
import { defaultThemes } from 'theme/default';
import { planckBnToUnit } from 'Utils';
import { NotesWrapper, Separator } from '../../Wrappers';
import { FormsProps } from '../types';
import { FormFooter } from './FormFooter';

export const BondAll = (props: FormsProps) => {
  const { setSection, setLocalResize } = props;

  const { mode } = useTheme();
  const { api, network } = useApi();
  const { units } = network;
  const { setStatus: setModalStatus, config } = useModal();
  const { activeAccount, accountHasSigner } = useConnect();
  const { getTransferOptions } = useTransferOptions();
  const { bondType } = config;
  const { txFees, txFeesValid } = useTxFees();

  const isStaking = bondType === 'stake';
  const isPooling = bondType === 'pool';

  const allTransferOptions = getTransferOptions(activeAccount);
  const { freeBalance: freeBalanceBn } = allTransferOptions;
  const { totalPossibleBond: totalPossibleBondBn } = isPooling
    ? allTransferOptions.pool
    : allTransferOptions.nominate;

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
    if (setLocalResize) setLocalResize();
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
      setModalStatus(2);
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
              <p style={{ color: defaultThemes.text.success[mode] }}>
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
        isValid={bondValid && accountHasSigner(activeAccount) && txFeesValid}
      />
    </>
  );
};
