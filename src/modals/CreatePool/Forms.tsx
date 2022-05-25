// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FooterWrapper, Separator } from '../Wrappers';
import { ContentWrapper } from './Wrapper';
import { useModal } from '../../contexts/Modal';
import { useBalances } from '../../contexts/Balances';
import { useApi } from '../../contexts/Api';
import { useConnect } from '../../contexts/Connect';
import { BondInputWithFeedback } from '../../library/Form/BondInputWithFeedback';
import { useSubmitExtrinsic } from '../../library/Hooks/useSubmitExtrinsic';
import { useStaking } from '../../contexts/Staking';

export const Forms = (props: any) => {
  const { api, network }: any = useApi();
  const { units } = network;
  const { setStatus: setModalStatus }: any = useModal();
  const { activeAccount } = useConnect();
  const { staking, getControllerNotImported } = useStaking();
  const { minNominatorBond } = staking;
  const { getBondOptions, getBondedAccount, getAccountNominations }: any =
    useBalances();
  const { freeToBond, freeToUnbond, totalPossibleBond } =
    getBondOptions(activeAccount);
  const controller = getBondedAccount(activeAccount);
  const controllerNotImported = getControllerNotImported(controller);

  // local bond value
  const [bond, setBond] = useState({ bond: freeToBond });

  // bond valid
  const [bondValid, setBondValid]: any = useState(false);

  useEffect(() => {
    if (!controllerNotImported) {
      setBondValid(true);
    } else {
      setBondValid(false);
    }
  }, [controllerNotImported]);

  // tx to submit
  const tx = () => {
    let _tx = null;
    if (!bondValid) {
      return _tx;
    }

    // remove decimal errors
    const bondToSubmit = Math.floor(bond.bond * 10 ** units).toString();
    _tx = api.tx.nominationPools.create(
      bondToSubmit,
      activeAccount,
      activeAccount,
      activeAccount
    );

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
    <ContentWrapper>
      <div>
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
