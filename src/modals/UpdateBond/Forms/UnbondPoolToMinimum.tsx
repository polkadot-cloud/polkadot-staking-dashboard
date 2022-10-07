// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';
import { useModal } from 'contexts/Modal';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { Warning } from 'library/Form/Warning';
import { useActivePool } from 'contexts/Pools/ActivePool';
import { planckBnToUnit, unitToPlanckBn } from 'Utils';
import { usePoolsConfig } from 'contexts/Pools/PoolsConfig';
import { BN } from 'bn.js';
import { EstimatedTxFee } from 'library/EstimatedTxFee';
import { useTxFees } from 'contexts/TxFees';
import { useTransferOptions } from 'contexts/TransferOptions';
import { useTranslation } from 'react-i18next';
import { Separator, NotesWrapper } from '../../Wrappers';
import { FormFooter } from './FormFooter';
import { FormsProps } from '../types';

export const UnbondPoolToMinimum = (props: FormsProps) => {
  const { setSection } = props;

  const { api, network, consts } = useApi();
  const { units } = network;
  const { setStatus: setModalStatus, setResize } = useModal();
  const { activeAccount, accountHasSigner } = useConnect();
  const { isDepositor } = useActivePool();
  const { getTransferOptions } = useTransferOptions();
  const { stats } = usePoolsConfig();
  const { txFeesValid } = useTxFees();
  const { t } = useTranslation('common');

  const { minJoinBond, minCreateBond } = stats;
  const { bondDuration } = consts;

  const { freeToUnbond: freeToUnbondBn } =
    getTransferOptions(activeAccount).pool;

  // unbond amount to minimum threshold
  const freeToUnbond = isDepositor()
    ? planckBnToUnit(
        BN.max(freeToUnbondBn.sub(minCreateBond), new BN(0)),
        units
      )
    : planckBnToUnit(BN.max(freeToUnbondBn.sub(minJoinBond), new BN(0)), units);

  // local bond value
  const [bond, setBond] = useState({
    bond: freeToUnbond,
  });

  // bond valid
  const [bondValid, setBondValid] = useState(false);

  // unbond all validation
  const isValid = (() => {
    return freeToUnbond > 0;
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

    // remove decimal errors
    const bondToSubmit = unitToPlanckBn(bond.bond, units);

    _tx = api.tx.nominationPools.unbond(activeAccount, bondToSubmit);
    return _tx;
  };

  const { submitTx, submitting } = useSubmitExtrinsic({
    tx: tx(),
    from: activeAccount,
    shouldSubmit: bondValid,
    callbackSubmit: () => {
      setModalStatus(0);
    },
    callbackInBlock: () => {},
  });

  return (
    <>
      <div className="items">
        <>
          {!accountHasSigner(activeAccount) && (
            <Warning text={t('modals.w1')} />
          )}
          <h4>{t('modals.amount_to_unbond')}</h4>
          <h2>
            {freeToUnbond} {network.unit}
          </h2>
          <Separator />
          <NotesWrapper>
            <p>{t('modals.update_bond4', { bondDuration })}</p>
            {bondValid && <EstimatedTxFee />}
          </NotesWrapper>
        </>
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
