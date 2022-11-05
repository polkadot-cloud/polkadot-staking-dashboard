// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BN_ZERO } from '@polkadot/util';
import { BN, max } from 'bn.js';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useTheme } from 'contexts/Themes';
import { useTransferOptions } from 'contexts/TransferOptions';
import { useTxFees } from 'contexts/TxFees';
import { EstimatedTxFee } from 'library/EstimatedTxFee';
import { BondFeedback } from 'library/Form/Bond/BondFeedback';
import { Warning } from 'library/Form/Warning';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { useEffect, useState } from 'react';
import { defaultThemes } from 'theme/default';
import { planckBnToUnit, unitToPlanckBn } from 'Utils';
import { NotesWrapper } from '../../Wrappers';
import { FormsProps } from '../types';
import { FormFooter } from './FormFooter';

export const BondSome = (props: FormsProps) => {
  const { section, setSection, setLocalResize } = props;

  const { api, network } = useApi();
  const { mode } = useTheme();
  const { units } = network;
  const { setStatus: setModalStatus, config } = useModal();
  const { activeAccount, accountHasSigner } = useConnect();
  const { getTransferOptions } = useTransferOptions();
  const { bondType } = config;
  const { txFees, txFeesValid } = useTxFees();
  const { selectedActivePool } = useActivePools();

  let { unclaimedRewards } = selectedActivePool || {};
  unclaimedRewards = unclaimedRewards ?? new BN(0);
  unclaimedRewards = planckBnToUnit(unclaimedRewards, network.units);

  const isStaking = bondType === 'stake';
  const isPooling = bondType === 'pool';

  const { freeBalance: freeBalanceBn } = getTransferOptions(activeAccount);
  const freeBalance = planckBnToUnit(freeBalanceBn, units);

  // local bond value
  const [bond, setBond] = useState({ bond: freeBalance });

  // bond minus tx fees
  const enoughToCoverTxFees: boolean =
    freeBalance - Number(bond.bond) > planckBnToUnit(txFees, units);

  const bondAfterTxFees = enoughToCoverTxFees
    ? unitToPlanckBn(Number(bond.bond), units)
    : max(unitToPlanckBn(Number(bond.bond), units).sub(txFees), new BN(0));

  // bond valid
  const [bondValid, setBondValid] = useState<boolean>(false);

  // update bond value on task change
  useEffect(() => {
    const _bond = freeBalance;
    setBond({ bond: _bond });
  }, [freeBalance]);

  // modal resize on form update
  useEffect(() => {
    if (section === 1) {
      if (setLocalResize) setLocalResize();
    }
  }, [bond, txFees, bondValid, section, setLocalResize]);

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
        />
        <NotesWrapper>
          {txFees.gt(BN_ZERO) && (
            <p style={{ color: defaultThemes.text.success[mode] }}>
              Transaction fees have been deducted from maximum bond.
            </p>
          )}
        </NotesWrapper>
        <EstimatedTxFee />
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
