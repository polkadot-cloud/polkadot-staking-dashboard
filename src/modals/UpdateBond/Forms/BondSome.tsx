// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN, { max } from 'bn.js';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useTransferOptions } from 'contexts/TransferOptions';
import { useTxFees } from 'contexts/TxFees';
import { EstimatedTxFee } from 'library/EstimatedTxFee';
import { BondFeedback } from 'library/Form/Bond/BondFeedback';
import { Warning } from 'library/Form/Warning';
import { useBondGreatestFee } from 'library/Hooks/useBondGreatestFee';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { useEffect, useState } from 'react';
import { planckBnToUnit, unitToPlanckBn } from 'Utils';
import { NotesWrapper } from '../../Wrappers';
import { FormsProps } from '../types';
import { FormFooter } from './FormFooter';

export const BondSome = ({ setSection, setLocalResize }: FormsProps) => {
  const { api, network } = useApi();
  const { units } = network;
  const { setStatus: setModalStatus, config } = useModal();
  const { activeAccount, accountHasSigner } = useConnect();
  const { getTransferOptions } = useTransferOptions();
  const { txFeesValid } = useTxFees();
  const { selectedActivePool } = useActivePools();
  const { bondType } = config;
  const isStaking = bondType === 'stake';
  const isPooling = bondType === 'pool';
  const { freeBalance: freeBalanceBn } = getTransferOptions(activeAccount);
  const freeBalance = planckBnToUnit(freeBalanceBn, units);
  const largestTxFee = useBondGreatestFee({ bondType });

  // calculate any unclaimed pool rewards.
  let { unclaimedRewards } = selectedActivePool || {};
  unclaimedRewards = unclaimedRewards ?? new BN(0);
  unclaimedRewards = planckBnToUnit(unclaimedRewards, network.units);

  // local bond value.
  const [bond, setBond] = useState({ bond: freeBalance });

  // bond valid.
  const [bondValid, setBondValid] = useState<boolean>(false);

  // bond minus tx fees.
  const enoughToCoverTxFees: boolean =
    freeBalance - Number(bond.bond) > planckBnToUnit(largestTxFee, units);

  // bond value after max tx fees have been deducated.
  let bondAfterTxFees: BN;
  if (enoughToCoverTxFees) {
    bondAfterTxFees = unitToPlanckBn(Number(bond.bond), units);
  } else {
    bondAfterTxFees = max(
      unitToPlanckBn(Number(bond.bond), units).sub(largestTxFee),
      new BN(0)
    );
  }

  // update bond value on task change.
  useEffect(() => {
    const _bond = freeBalance;
    setBond({ bond: _bond });
  }, [freeBalance]);

  // determine whether this is a pool or staking transaction.
  const determineTx = (bondToSubmit: string) => {
    let _tx = null;
    if (!api) {
      return _tx;
    }
    if (isPooling) {
      _tx = api.tx.nominationPools.bondExtra({
        FreeBalance: bondToSubmit,
      });
    } else if (isStaking) {
      _tx = api.tx.staking.bondExtra(bondToSubmit);
    }
    return _tx;
  };

  // the actual bond tx to submit
  const tx = (bondToSubmit: string) => {
    if (!bondValid || !activeAccount) {
      return null;
    }
    return determineTx(bondToSubmit);
  };

  const { submitTx, submitting } = useSubmitExtrinsic({
    tx: tx(bondAfterTxFees.toString()),
    from: activeAccount,
    shouldSubmit: bondValid,
    callbackSubmit: () => {
      setModalStatus(2);
    },
    callbackInBlock: () => {},
  });

  const warnings = [];
  if (!accountHasSigner(activeAccount)) {
    warnings.push('Your account is read only, and cannot sign transactions.');
  }

  return (
    <>
      <div className="items">
        {unclaimedRewards > 0 && bondType === 'pool' && (
          <Warning
            text={`Bonding will also withdraw your outstanding rewards of ${unclaimedRewards} ${network.unit}.`}
          />
        )}
        <BondFeedback
          syncing={largestTxFee.eq(new BN(0))}
          bondType={bondType}
          listenIsValid={setBondValid}
          defaultBond={null}
          setLocalResize={setLocalResize}
          setters={[
            {
              set: setBond,
              current: bond,
            },
          ]}
          warnings={warnings}
          txFees={largestTxFee}
        />
        <NotesWrapper>
          <EstimatedTxFee />
        </NotesWrapper>
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
