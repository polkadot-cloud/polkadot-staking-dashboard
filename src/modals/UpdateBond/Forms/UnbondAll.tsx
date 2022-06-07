// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';
import { useModal } from 'contexts/Modal';
import { useBalances } from 'contexts/Balances';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { Warning } from 'library/Form/Warning';
import { useStaking } from 'contexts/Staking';
import { APIContextInterface } from 'types/api';
import { ConnectContextInterface } from 'types/connect';
import { usePools } from 'contexts/Pools';
import { Separator, NotesWrapper } from '../../Wrappers';
import { FormFooter } from './FormFooter';

export const UnbondAll = (props: any) => {
  const { setSection } = props;

  const { api, network } = useApi() as APIContextInterface;
  const { units } = network;
  const { setStatus: setModalStatus, setResize, config }: any = useModal();
  const { activeAccount } = useConnect() as ConnectContextInterface;
  const { getControllerNotImported } = useStaking();
  const { getBondOptions, getBondedAccount, getAccountNominations }: any =
    useBalances();
  const { getPoolBondOptions } = usePools();
  const { target } = config;
  const controller = getBondedAccount(activeAccount);
  const nominations = getAccountNominations(activeAccount);
  const controllerNotImported = getControllerNotImported(controller);
  const stakeBondOptions = getBondOptions(activeAccount);
  const poolBondOptions = getPoolBondOptions(activeAccount);
  const isStaking = target === 'stake';
  const isPooling = target === 'pool';

  const { freeToUnbond } = isPooling ? poolBondOptions : stakeBondOptions;

  // local bond value
  const [bond, setBond] = useState(freeToUnbond);

  // bond valid
  const [bondValid, setBondValid]: any = useState(false);

  // unbond all validation
  const isValid = (() => {
    let _isValid = false;
    if (isPooling) {
      _isValid = freeToUnbond > 0;
    } else {
      _isValid =
        freeToUnbond > 0 && nominations.length === 0 && !controllerNotImported;
    }
    return _isValid;
  })();

  // update bond value on task change
  useEffect(() => {
    const _bond = freeToUnbond;
    setBond({ bond: _bond });
    setBondValid(isValid);
  }, [freeToUnbond, isValid]);

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

    // stake unbond: controller must be imported
    if (isStaking && controllerNotImported) {
      return _tx;
    }
    // remove decimal errors
    const bondToSubmit = Math.floor(bond.bond * 10 ** units).toString();

    // determine _tx
    if (isPooling) {
      _tx = api.tx.nominationPools.unbond(activeAccount, bondToSubmit);
    } else if (isStaking) {
      _tx = api.tx.staking.unbond(bondToSubmit);
    }
    return _tx;
  };

  const { submitTx, estimatedFee, submitting }: any = useSubmitExtrinsic({
    tx: tx(),
    from: isPooling ? activeAccount : controller,
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
          {isStaking && controllerNotImported ? (
            <Warning text="You must have your controller account imported to unbond." />
          ) : (
            <></>
          )}
          {isStaking && nominations.length ? (
            <Warning text="Stop nominating before unbonding all funds." />
          ) : (
            <></>
          )}
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
      </div>
      <FormFooter
        setSection={setSection}
        submitTx={submitTx}
        submitting={submitting}
        isValid={bondValid}
      />
    </>
  );
};
