// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useModal } from 'contexts/Modal';
import { useBalances } from 'contexts/Balances';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { BondInputWithFeedback } from 'library/Form/BondInputWithFeedback';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { ConnectContextInterface } from 'types/connect';
import { BondOptionsInterface } from 'types/balances';
import { planckBnToUnit, unitToPlanckBn } from 'Utils';
import { ContentWrapper } from './Wrapper';
import { FooterWrapper, NotesWrapper } from '../Wrappers';

export const Forms = () => {
  const { api, network }: any = useApi();
  const { units } = network;
  const { setStatus: setModalStatus, config, setResize }: any = useModal();
  const { id: poolId } = config;
  const { activeAccount } = useConnect() as ConnectContextInterface;

  const { getBondOptions }: any = useBalances();
  const { freeToBond }: BondOptionsInterface = getBondOptions(activeAccount);

  // local bond value
  const [bond, setBond] = useState({ bond: planckBnToUnit(freeToBond, units) });

  // bond valid
  const [bondValid, setBondValid]: any = useState(true);

  // modal resize on form update
  useEffect(() => {
    setResize();
  }, [bond]);

  // tx to submit
  const tx = () => {
    let _tx = null;
    if (!bondValid) {
      return _tx;
    }

    // remove decimal errors
    const bondToSubmit = unitToPlanckBn(bond.bond, units);
    _tx = api.tx.nominationPools.join(bondToSubmit, poolId);

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
    <p>Estimated Tx Fee: {estimatedFee === null ? '...' : `${estimatedFee}`}</p>
  );

  return (
    <ContentWrapper>
      <div>
        <>
          <BondInputWithFeedback
            bondType="pool"
            unbond={false}
            listenIsValid={setBondValid}
            defaultBond={planckBnToUnit(freeToBond, units)}
            setters={[
              {
                set: setBond,
                current: bond,
              },
            ]}
          />
          <NotesWrapper>{TxFee}</NotesWrapper>
        </>
      </div>
      <FooterWrapper>
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
};

export default Forms;
