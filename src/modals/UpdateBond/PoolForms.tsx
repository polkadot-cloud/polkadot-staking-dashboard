// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect, forwardRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { usePools } from 'contexts/Pools';
import { useModal } from 'contexts/Modal';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { BondInputWithFeedback } from 'library/Form/BondInputWithFeedback';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { Warning } from 'library/Form/Warning';
import { planckBnToUnit } from 'Utils';
import { ConnectContextInterface } from 'types/connect';
import { ContentWrapper } from './Wrappers';
import { FooterWrapper, Separator, NotesWrapper } from '../Wrappers';

export const PoolForms = forwardRef((props: any, ref: any) => {
  const { setSection, task } = props;
  const { api, network }: any = useApi();
  const { activeAccount } = useConnect() as ConnectContextInterface;
  const { units } = network;
  const { setStatus: setModalStatus, setResize }: any = useModal();
  const { getPoolBondOptions, stats } = usePools();
  const { minJoinBond } = stats;
  const { freeToBond, freeToUnbond, totalPossibleBond } =
    getPoolBondOptions(activeAccount);

  // unbond amount to `minNominatorBond` threshold
  const freeToUnbondToMinPoolBond = Math.max(
    freeToUnbond - planckBnToUnit(minJoinBond, units),
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
        ? freeToUnbondToMinPoolBond
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
      // ToDO: check if there is any specific cases that needs to not be allowed to unbond all.
      setBondValid(true);
    }
    if (task === 'unbond_some') {
      setBondValid(true);
    }
  }, [task]);

  // modal resize on form update
  useEffect(() => {
    setResize();
  }, [bond]);

  // tx to submit
  const tx = () => {
    let _tx = null;
    if (!bondValid || !activeAccount) {
      return _tx;
    }

    // remove decimal errors
    const bondToSubmit = Math.floor(bond.bond * 10 ** units);
    if (task === 'bond_some' || task === 'bond_all') {
      _tx = api.tx.nominationPools.bondExtra({ FreeBalance: bondToSubmit });
    } else if (task === 'unbond_some' || task === 'unbond_all') {
      _tx = api.tx.nominationPools.unbond(activeAccount, bondToSubmit);
    }
    return _tx;
  };

  const { submitTx, estimatedFee, submitting }: any = useSubmitExtrinsic({
    tx: tx(),
    from: activeAccount,
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
              subject="pools"
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
            <NotesWrapper>{TxFee}</NotesWrapper>
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
        )}
        {task === 'unbond_some' && (
          <>
            <BondInputWithFeedback
              subject="pools"
              unbond
              listenIsValid={setBondValid}
              defaultBond={freeToUnbondToMinPoolBond}
              setters={[
                {
                  set: setBond,
                  current: bond,
                },
              ]}
            />
            <NotesWrapper>
              <p>
                Once unbonding, you must wait 28 days for your funds to become
                available.
              </p>
              {TxFee}
            </NotesWrapper>
          </>
        )}
        {task === 'unbond_all' && (
          <>
            <h4>Amount to unbond:</h4>
            <h2>
              {freeToUnbond} {network.unit}
            </h2>
            <Separator />
            <NotesWrapper>
              <p>
                Once unbonding, you must wait 28 days for your funds to become
                available.
              </p>
              {bondValid && TxFee}
            </NotesWrapper>
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

export default PoolForms;
