// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';
import { FooterWrapper } from '../Wrappers';
import { useModal } from '../../contexts/Modal';
import { useBalances } from '../../contexts/Balances';
import { useApi } from '../../contexts/Api';
import { useConnect } from '../../contexts/Connect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { BondInputWithFeedback } from '../../library/Form/BondInputWithFeedback';
import { ContentWrapper, Separator } from './Wrapper';
import { useSubmitExtrinsic } from '../../library/Hooks/useSubmitExtrinsic';
import { Warning } from '../../library/Form/Warning';
import { useStaking } from '../../contexts/Staking';
import { planckBnToUnit } from '../../Utils';

export const Forms = (props: any) => {
  const { setSection, task } = props;

  const { api, network }: any = useApi();
  const { units } = network;
  const { setStatus: setModalStatus }: any = useModal();
  const { activeAccount } = useConnect();
  const { staking } = useStaking();
  const { minNominatorBond } = staking;
  const { getBondOptions, getBondedAccount, getAccountNominations }: any = useBalances();
  const { freeToBond, freeToUnbond, totalPossibleBond } = getBondOptions(activeAccount);
  const controller = getBondedAccount(activeAccount);
  const nominations = getAccountNominations(activeAccount);

  // unbond amount to `minNominatorBond` threshold
  const freeToUnbondToMinNominatorBond = freeToUnbond - planckBnToUnit(minNominatorBond, units);

  // local bond value
  const [bond, setBond] = useState(freeToBond);

  // bond valid
  const [bondValid, setBondValid]: any = useState(false);

  // update bond value on task change
  useEffect(() => {
    let _bond = (task === 'bond_some' || task === 'bond_all')
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
      if (freeToUnbondToMinNominatorBond > 0 && nominations.length === 0) {
        setBondValid(true);
      } else {
        setBondValid(false);
      }
    }
  }, [task]);

  // tx to submit
  const tx = () => {
    let tx = null;

    if (!bondValid) {
      return tx;
    }

    // remove decimal errors
    let bondToSubmit = Math.floor(bond.bond * (10 ** units)).toString();

    if (task === 'bond_some' || task === 'bond_all') {
      tx = api.tx.staking.bondExtra(bondToSubmit);

    } else if (task === 'unbond_some' || task === 'unbond_all') {
      tx = api.tx.staking.unbond(bondToSubmit);
    }
    return tx;
  }

  const { submitTx, estimatedFee, submitting }: any = useSubmitExtrinsic({
    tx: tx(),
    from: (task === 'bond_some' || task === 'bond_all') ? activeAccount : controller,
    shouldSubmit: bondValid,
    callbackSubmit: () => {
      setModalStatus(0);
    },
    callbackInBlock: () => {
    }
  });

  const TxFee = <p>Estimated Tx Fee: {estimatedFee === null ? '...' : `${estimatedFee}`}</p>;

  return (
    <ContentWrapper>
      <div className='items'>
        {task === 'bond_some' &&
          <>
            <BondInputWithFeedback
              unbond={false}
              listenIsValid={setBondValid}
              defaultBond={freeToBond}
              setters={[{
                set: setBond,
                current: bond
              }]}
            />
            <div className='notes'>
              {TxFee}
            </div>
          </>
        }
        {task === 'bond_all' &&
          <>
            {freeToBond === 0 &&
              <Warning text="You have no free WND to bond." />
            }
            <h4>Amount to bond:</h4>
            <h2>{freeToBond} {network.unit}</h2>
            <p>This amount of {network.unit} will be added to your current bonded funds.</p>
            <Separator />
            <h4>New total bond:</h4>
            <h2>{totalPossibleBond} {network.unit}</h2>
            <div className='notes'>
              {TxFee}
            </div>
          </>
        }
        {task === 'unbond_some' &&
          <>
            <BondInputWithFeedback
              unbond={true}
              listenIsValid={setBondValid}
              defaultBond={freeToUnbondToMinNominatorBond}
              setters={[{
                set: setBond,
                current: bond
              }]}
            />
            <div className='notes'>
              <p>Once unbonding, you must wait 28 days for your funds to become available.</p>
              {TxFee}
            </div>
          </>
        }
        {task === 'unbond_all' &&
          <>
            {nominations.length &&
              <Warning text="Stop nominating before unbonding all funds." />
            }
            <h4>Amount to unbond:</h4>
            <h2>{freeToUnbond} {network.unit}</h2>
            <div className='notes'>
              <p>Once unbonding, you must wait 28 days for your funds to become available.</p>
              {TxFee}
            </div>
          </>
        }
      </div>
      <FooterWrapper>
        <div>
          <button
            className='submit'
            onClick={() => setSection(0)}
          >
            <FontAwesomeIcon transform='shrink-2' icon={faChevronLeft} />
            Back
          </button>
        </div>
        <div>
          <button className='submit' onClick={() => submitTx()} disabled={submitting || !bondValid}>
            <FontAwesomeIcon transform='grow-2' icon={faArrowAltCircleUp as IconProp} />
            Submit{submitting && 'ting'}
          </button>
        </div>
      </FooterWrapper>
    </ContentWrapper>
  )
}

export default Forms;