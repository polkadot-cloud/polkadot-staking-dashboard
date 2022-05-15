// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { useState, useEffect } from 'react';
import { useApi } from '../../../contexts/Api';
import { useConnect } from '../../../contexts/Connect';
import { useBalances } from '../../../contexts/Balances';
import { useStaking } from '../../../contexts/Staking';
import { BondInput } from '../BondInput';
import { planckToUnit, humanNumber, toFixedIfNecessary } from '../../../Utils';
import { Warning, Spacer } from '../Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

export const BondInputWithFeedback = (props: any) => {

  // input props
  const { defaultBond, unbond } = props;
  const nominating = props.nominating ?? false;

  // functional props
  let setters = props.setters ?? [];
  let listenIsValid: any = props.listenIsValid ?? (() => { });

  const { network }: any = useApi();
  const { activeAccount } = useConnect();
  const { staking } = useStaking();
  const { getAccountBalance, getAccountLedger, getBondedAccount }: any = useBalances();

  const balance = getAccountBalance(activeAccount);
  const controller = getBondedAccount(activeAccount);
  const ledger = getAccountLedger(controller);

  const { units } = network;
  const { active } = ledger;
  const { minNominatorBond } = staking;
  let { freeAfterReserve } = balance;

  let freeToBond: any = toFixedIfNecessary(planckToUnit(freeAfterReserve.sub(active).toNumber(), units), units);
  freeToBond = freeToBond < 0 ? 0 : freeToBond;

  let activeBase = planckToUnit(active.toNumber(), units);
  let minNominatorBondBase = minNominatorBond.div(new BN(10 ** units)).toNumber();

  // store errors
  const [errors, setErrors]: any = useState([]);

  // local bond state
  const [bond, setBond]: any = useState({
    bond: defaultBond
  });

  // whether bond is disabled
  const [bondDisabled, setBondDisabled] = useState(false);

  // add this setBond to setters
  setters.push({
    set: setBond,
    current: bond,
  });

  // update bond on account change
  useEffect(() => {
    setBond({
      bond: defaultBond
    });
  }, [activeAccount]);

  // handle errors on input change
  useEffect(() => {
    handleErrors();
  }, [bond]);

  // handle error updates
  const handleErrors = () => {

    let _bondDisabled = false;
    let _errors = new Array();

    // bond errors
    if (!unbond) {

      if (freeToBond === 0) {
        _bondDisabled = true;
        _errors.push(`You have no free ${network.unit} to bond.`);
      }

      if (bond.bond !== '' && bond.bond > freeToBond) {
        _errors.push(`Bond amount is more than your free balance.`);
      }

      if (nominating) {

        if (freeToBond < minNominatorBondBase) {
          _bondDisabled = true;
          _errors.push(`You do not meet the minimum nominator bond of ${minNominatorBondBase} ${network.unit}.`);
        }

        if (bond.bond !== '' && bond.bond < minNominatorBondBase) {
          _errors.push('Bond amount must be at least ' + minNominatorBondBase + ' ' + network.unit + '.');
        }
      }
    }

    // unbond errors
    if (unbond) {

      if (bond.bond !== '' && bond.bond > activeBase) {
        _errors.push(`Unbond amount is more than your bonded balance.`);
      }
    }

    let bondValid = !_errors.length && bond.bond !== '';

    setBondDisabled(_bondDisabled);
    listenIsValid(bondValid);
    setErrors(_errors);
  }

  return (
    <>
      <div className='head'>
        <h4>{unbond ? 'Bonded' : 'Available'}: {unbond ? humanNumber(activeBase) : humanNumber(freeToBond)} {network.unit}</h4>
      </div>
      {errors.map((err: any, index: any) =>
        <Warning key={`setup_error_${index}`}>
          <FontAwesomeIcon icon={faExclamationTriangle} transform="shrink-2" />
          <h4>{err}</h4>
        </Warning>
      )}
      <Spacer />
      <BondInput
        task={unbond ? 'unbond' : 'bond'}
        value={bond.bond}
        defaultValue={defaultBond}
        disabled={bondDisabled}
        setters={setters}
      />
    </>
  )
};

export default BondInputWithFeedback;