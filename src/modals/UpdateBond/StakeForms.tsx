// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect, forwardRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FooterWrapper, Separator } from '../Wrappers';
import { ContentWrapper } from './Wrappers';
import { useModal } from '../../contexts/Modal';
import { useBalances } from '../../contexts/Balances';
import { useApi } from '../../contexts/Api';
import { useConnect } from '../../contexts/Connect';
import { BondInputWithFeedback } from '../../library/Form/BondInputWithFeedback';
import { useSubmitExtrinsic } from '../../library/Hooks/useSubmitExtrinsic';
import { Warning } from '../../library/Form/Warning';
import { useStaking } from '../../contexts/Staking';
import { planckBnToUnit } from '../../Utils';
import { APIContextInterface } from '../../types/api';

export const StakeForms = forwardRef((props: any, ref: any) => {
  const { setSection, task } = props;

  const { api, network } = useApi() as APIContextInterface;
  const { units } = network;
  const { setStatus: setModalStatus, setResize }: any = useModal();
  const { activeAccount } = useConnect();
  const { staking, getControllerNotImported } = useStaking();
  const { minNominatorBond } = staking;
  const { getBondOptions, getBondedAccount, getAccountNominations }: any =
    useBalances();
  const { freeToBond, freeToUnbond, totalPossibleBond } =
    getBondOptions(activeAccount);
  const controller = getBondedAccount(activeAccount);
  const nominations = getAccountNominations(activeAccount);
  const controllerNotImported = getControllerNotImported(controller);

  // unbond amount to `minNominatorBond` threshold
  const freeToUnbondToMinNominatorBond = Math.max(
    freeToUnbond - planckBnToUnit(minNominatorBond, units),
    0
  );

  // local bond value
  const [bond, setBond] = useState(freeToBond);

  // bond valid
  const [bondValid, setBondValid]: any = useState(false);

  // update bond value on task change
  useEffect(() => {
    const _bond =
      task === 'bond_some' || task === 'bond_all'
        ? freeToBond
        : task === 'unbond_some'
        ? freeToUnbondToMinNominatorBond
        : freeToUnbond;

    setBond({ bond: _bond });

    if (task === 'bond_all') {
      if (freeToBond > 0) {
        setBondValid(true);
      } else {
        setBondValid(false);
      }
    }
    if (task === 'unbond_all') {
      if (
        freeToUnbond > 0 &&
        nominations.length === 0 &&
        !controllerNotImported
      ) {
        setBondValid(true);
      } else {
        setBondValid(false);
      }
    }
    if (task === 'unbond_some') {
      if (!controllerNotImported) {
        setBondValid(true);
      } else {
        setBondValid(false);
      }
    }
  }, [task]);

  // modal resize on form update
  useEffect(() => {
    setResize();
  }, [bond]);

  // tx to submit
  const tx = () => {
    let _tx = null;
    if (!bondValid || !api) {
      return _tx;
    }

    // controller must be imported
    if (
      (task === 'unbond_some' || task === 'unbond_all') &&
      controllerNotImported
    ) {
      return _tx;
    }
    // remove decimal errors
    const bondToSubmit = Math.floor(bond.bond * 10 ** units).toString();

    if (task === 'bond_some' || task === 'bond_all') {
      _tx = api.tx.staking.bondExtra(bondToSubmit);
    } else if (task === 'unbond_some' || task === 'unbond_all') {
      _tx = api.tx.staking.unbond(bondToSubmit);
    }
    return _tx;
  };

  const { submitTx, estimatedFee, submitting }: any = useSubmitExtrinsic({
    tx: tx(),
    from:
      task === 'bond_some' || task === 'bond_all' ? activeAccount : controller,
    shouldSubmit: bondValid,
    callbackSubmit: () => {
      setModalStatus(0);
    },
    callbackInBlock: () => {},
  });

  const TxFee = (
    <p>
      Estimated Tx Fee:
      {estimatedFee === null ? '...' : `${estimatedFee}`}
    </p>
  );

  return (
    <ContentWrapper ref={ref}>
      <div className="items">
        {task === 'bond_some' && (
          <>
            <BondInputWithFeedback
              unbond={false}
              listenIsValid={setBondValid}
              defaultBond={freeToBond}
              setters={[
                {
                  set: setBond,
                  current: bond,
                },
              ]}
            />
            <div className="notes">{TxFee}</div>
          </>
        )}
        {task === 'bond_all' && (
          <>
            {freeToBond === 0 && (
              <Warning text={`You have no free ${network.unit} to bond.`} />
            )}
            <h4>Amount to bond:</h4>
            <h2>
              {freeToBond} {network.unit}
            </h2>
            <p>
              This amount of
              {network.unit} will be added to your current bonded funds.
            </p>
            <Separator />
            <h4>New total bond:</h4>
            <h2>
              {totalPossibleBond} {network.unit}
            </h2>
            <div className="notes">{TxFee}</div>
          </>
        )}
        {task === 'unbond_some' && (
          <>
            <BondInputWithFeedback
              unbond
              listenIsValid={setBondValid}
              defaultBond={freeToUnbondToMinNominatorBond}
              setters={[
                {
                  set: setBond,
                  current: bond,
                },
              ]}
            />
            <div className="notes">
              <p>
                Once unbonding, you must wait 28 days for your funds to become
                available.
              </p>
              {TxFee}
            </div>
          </>
        )}
        {task === 'unbond_all' && (
          <>
            {controllerNotImported ? (
              <Warning text="You must have your controller account imported to unbond." />
            ) : (
              <></>
            )}
            {nominations.length ? (
              <Warning text="Stop nominating before unbonding all funds." />
            ) : (
              <></>
            )}
            <h4>Amount to unbond:</h4>
            <h2>
              {freeToUnbond} {network.unit}
            </h2>
            <Separator />
            <div className="notes">
              <p>
                Once unbonding, you must wait 28 days for your funds to become
                available.
              </p>
              {bondValid && TxFee}
            </div>
          </>
        )}
      </div>
      <FooterWrapper>
        <div>
          <button
            type="button"
            className="submit"
            onClick={() => setSection(0)}
          >
            <FontAwesomeIcon transform="shrink-2" icon={faChevronLeft} />
            Back
          </button>
        </div>
        <div>
          <button
            type="button"
            className="submit"
            onClick={() => submitTx()}
            disabled={submitting || !bondValid}
          >
            <FontAwesomeIcon
              transform="grow-2"
              icon={faArrowAltCircleUp as IconProp}
            />
            Submit
            {submitting && 'ting'}
          </button>
        </div>
      </FooterWrapper>
    </ContentWrapper>
  );
});

export default StakeForms;
