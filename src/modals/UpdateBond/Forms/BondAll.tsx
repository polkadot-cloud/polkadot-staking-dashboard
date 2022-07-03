// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';
import { useModal } from 'contexts/Modal';
import { useBalances } from 'contexts/Balances';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { Warning } from 'library/Form/Warning';
import { ConnectContextInterface } from 'types/connect';
import { useActivePool } from 'contexts/Pools/ActivePool';
import { ActivePoolContextState } from 'types/pools';
import { BalancesContextInterface, BondOptions } from 'types/balances';
import { planckBnToUnit, unitToPlanckBn } from 'Utils';
import { Separator, NotesWrapper } from '../../Wrappers';
import { FormFooter } from './FormFooter';

export const BondAll = (props: any) => {
  const { setSection } = props;

  const { api, network } = useApi();
  const { units } = network;
  const { setStatus: setModalStatus, setResize, config } = useModal();
  const { activeAccount, accountHasSigner } =
    useConnect() as ConnectContextInterface;
  const { getBondOptions } = useBalances() as BalancesContextInterface;
  const { bondType } = config;
  const { getPoolBondOptions } = useActivePool() as ActivePoolContextState;

  const stakeBondOptions: BondOptions = getBondOptions(activeAccount);
  const poolBondOptions = getPoolBondOptions(activeAccount);
  const isStaking = bondType === 'stake';
  const isPooling = bondType === 'pool';

  const { freeToBond: freeToBondBn } = isPooling
    ? poolBondOptions
    : stakeBondOptions;
  const { totalPossibleBond: totalPossibleBondBn } = isPooling
    ? poolBondOptions
    : stakeBondOptions;

  // convert BN values to number
  const freeToBond = planckBnToUnit(freeToBondBn, units);
  const totalPossibleBond = planckBnToUnit(totalPossibleBondBn, units);

  // local bond value
  const [bond, setBond] = useState({ bond: freeToBond });

  // bond valid
  const [bondValid, setBondValid] = useState(false);

  // update bond value on task change
  useEffect(() => {
    const _bond = freeToBond;
    setBond({ bond: _bond });
    if (_bond > 0) {
      setBondValid(true);
    } else {
      setBondValid(false);
    }
  }, [freeToBond]);

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

    // remove decimal errors
    const bondToSubmit = unitToPlanckBn(bond.bond, units);

    // determine _tx
    if (isPooling) {
      _tx = api.tx.nominationPools.bondExtra({ FreeBalance: bondToSubmit });
    } else if (isStaking) {
      _tx = api.tx.staking.bondExtra(bondToSubmit);
    }
    return _tx;
  };

  const { submitTx, estimatedFee, submitting } = useSubmitExtrinsic({
    tx: tx(),
    from: activeAccount,
    shouldSubmit: bondValid,
    callbackSubmit: () => {
      setModalStatus(0);
    },
    callbackInBlock: () => {},
  });

  const TxFee = (
    <p>Estimated Tx Fee: {estimatedFee === null ? '...' : `${estimatedFee}`}</p>
  );

  return (
    <>
      <div className="items">
        <>
          {!accountHasSigner(activeAccount) && (
            <Warning text="Your account is read only, and cannot sign transactions." />
          )}
          {freeToBond === 0 && (
            <Warning text={`You have no free ${network.unit} to bond.`} />
          )}
          <h4>Amount to bond:</h4>
          <h2>
            {freeToBond} {network.unit}
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
          <NotesWrapper>{TxFee}</NotesWrapper>
        </>
      </div>
      <FormFooter
        setSection={setSection}
        submitTx={submitTx}
        submitting={submitting}
        isValid={bondValid && accountHasSigner(activeAccount)}
      />
    </>
  );
};
