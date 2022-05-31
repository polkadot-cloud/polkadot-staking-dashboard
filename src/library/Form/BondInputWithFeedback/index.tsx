// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';
import { usePools } from 'contexts/Pools';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useBalances } from 'contexts/Balances';
import { useStaking } from 'contexts/Staking';
import { humanNumber, planckBnToUnit } from 'Utils';
import { SectionHeaderWrapper } from 'library/Graphs/Wrappers';
import { APIContextInterface } from 'types/api';
import { ConnectContextInterface } from 'types/connect';
import { BondInput } from '../BondInput';
import { Spacer } from '../Wrappers';
import { Warning } from '../Warning';

export const BondInputWithFeedback = (props: any) => {
  // input props
  const { subject, defaultBond, unbond } = props;
  const nominating = props.nominating ?? false;

  // functional props
  const setters = props.setters ?? [];
  const listenIsValid: any = props.listenIsValid ?? (() => {});

  const { network }: any = useApi() as APIContextInterface;
  const { activeAccount } = useConnect() as ConnectContextInterface;
  const { staking, getControllerNotImported } = useStaking();
  const { getAccountLedger, getBondedAccount, getBondOptions }: any =
    useBalances();
  const { getPoolBondOptions, stats } = usePools();
  const { minJoinBond } = stats;

  const controller = getBondedAccount(activeAccount);
  const ledger = getAccountLedger(activeAccount);
  const { units } = network;
  const { active } = ledger;
  const { minNominatorBond } = staking;

  const minBondBase =
    subject === 'pools'
      ? planckBnToUnit(minJoinBond, units)
      : planckBnToUnit(minNominatorBond, units);

  // get bond options for either staking or pooling.
  const options =
    subject === 'pools'
      ? getPoolBondOptions(activeAccount)
      : getBondOptions(activeAccount);

  const { freeToBond, freeToUnbond, active: poolsActive } = options;

  // unbond amount to `minNominatorBond` threshold for staking,
  // and unbond amount to `minJoinBond` for pools.
  const freeToUnbondToMin =
    subject === 'pools'
      ? Math.max(freeToUnbond - planckBnToUnit(minJoinBond, units), 0)
      : Math.max(freeToUnbond - planckBnToUnit(minNominatorBond, units), 0);

  // get the actively bonded amount.
  const activeBase =
    subject === 'pools'
      ? planckBnToUnit(poolsActive, units)
      : planckBnToUnit(active, units);

  // store errors
  const [errors, setErrors]: any = useState([]);

  // local bond state
  const [bond, setBond]: any = useState({
    bond: defaultBond,
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
      bond: defaultBond,
    });
  }, [activeAccount]);

  // handle errors on input change
  useEffect(() => {
    handleErrors();
  }, [bond]);

  // handle error updates
  const handleErrors = () => {
    let _bondDisabled = false;
    const _errors = [];

    // bond errors
    if (!unbond) {
      if (freeToBond === 0) {
        _bondDisabled = true;
        _errors.push(`You have no free ${network.unit} to bond.`);
      }

      if (bond.bond !== '' && bond.bond > freeToBond) {
        _errors.push('Bond amount is more than your free balance.');
      }

      // bond errors
      if (nominating) {
        if (freeToBond < minBondBase) {
          _bondDisabled = true;
          _errors.push(
            `You do not meet the minimum bond of ${minBondBase} ${network.unit}.`
          );
        }

        if (bond.bond !== '' && bond.bond < minBondBase) {
          _errors.push(
            `Bond amount must be at least ${minBondBase} ${network.unit}.`
          );
        }
      }
    }

    // unbond errors
    if (unbond) {
      if (bond.bond !== '' && bond.bond > activeBase) {
        _errors.push('Unbond amount is more than your bonded balance.');
      }

      // unbond errors for staking only
      if (subject === 'stake') {
        if (getControllerNotImported(controller)) {
          _errors.push(
            'You must have your controller account imported to unbond.'
          );
        }
      }

      if (bond.bond !== '' && bond.bond > freeToUnbondToMin) {
        _errors.push(
          `A minimum bond of ${minBondBase} ${network.unit} is required when ${
            subject === 'stake' ? `actively nominating` : `in your pool`
          }.`
        );
      }
    }
    const bondValid = !_errors.length && bond.bond !== '';

    setBondDisabled(_bondDisabled);
    listenIsValid(bondValid);
    setErrors(_errors);
  };

  return (
    <>
      <SectionHeaderWrapper>
        <h4>
          {unbond ? 'Bonded' : 'Available'}:{' '}
          {unbond ? humanNumber(activeBase) : humanNumber(freeToBond)}{' '}
          {network.unit}
        </h4>
      </SectionHeaderWrapper>
      {errors.map((err: any, index: any) => (
        <Warning key={`setup_error_${index}`} text={err} />
      ))}
      <Spacer />
      <BondInput
        task={unbond ? 'unbond' : 'bond'}
        value={bond.bond}
        defaultValue={defaultBond}
        disabled={bondDisabled}
        setters={setters}
        freeToBond={freeToBond}
        freeToUnbondToMin={freeToUnbondToMin}
      />
    </>
  );
};

export default BondInputWithFeedback;
