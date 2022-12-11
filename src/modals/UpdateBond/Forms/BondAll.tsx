// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BN_ZERO } from '@polkadot/util';
import BN from 'bn.js';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useTransferOptions } from 'contexts/TransferOptions';
import { useTxFees } from 'contexts/TxFees';
import { EstimatedTxFee } from 'library/EstimatedTxFee';
import { Warning } from 'library/Form/Warning';
import useBondGreatestFee from 'library/Hooks/useBondGreatestFee';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { planckBnToUnit } from 'Utils';
import { Separator } from '../../Wrappers';
import { FormsProps } from '../types';
import { FormFooter } from './FormFooter';

export const BondAll = (props: FormsProps) => {
  const { setSection, setLocalResize } = props;
  const { t } = useTranslation('modals');

  const { api, network } = useApi();
  const { units, unit } = network;
  const { setStatus: setModalStatus, config } = useModal();
  const { activeAccount, accountHasSigner } = useConnect();
  const { getTransferOptions } = useTransferOptions();
  const { bondType } = config;
  const { txFees, txFeesValid } = useTxFees();
  const { selectedActivePool } = useActivePools();
  const largestTxFee = useBondGreatestFee({ bondType });

  let { unclaimedRewards } = selectedActivePool || {};
  unclaimedRewards = unclaimedRewards ?? new BN(0);
  unclaimedRewards = planckBnToUnit(unclaimedRewards, network.units);

  const isStaking = bondType === 'stake';
  const isPooling = bondType === 'pool';

  const allTransferOptions = getTransferOptions(activeAccount);
  const { freeBalance: freeBalanceBn } = allTransferOptions;
  const { totalPossibleBond: totalPossibleBondBn } = isPooling
    ? allTransferOptions.pool
    : allTransferOptions.nominate;

  // convert BN values to number
  const freeBalance = planckBnToUnit(freeBalanceBn, units);

  // local bond value
  const [bond, setBond] = useState({ bond: freeBalance });

  // bond minus tx fees
  const bondAfterTxFees = BN.max(freeBalanceBn.sub(largestTxFee), BN_ZERO);

  // total possible bond after tx fees
  const totalPossibleBond = planckBnToUnit(
    BN.max(totalPossibleBondBn.sub(largestTxFee), BN_ZERO),
    units
  );

  // bond valid
  const [bondValid, setBondValid] = useState(false);

  // update bond value on task change
  useEffect(() => {
    const _bond = freeBalance;
    setBond({ bond: _bond });
    if (_bond > 0 && bondAfterTxFees.gt(BN_ZERO)) {
      setBondValid(true);
    } else {
      setBondValid(false);
    }
  }, [freeBalance, txFees]);

  // modal resize on form update
  useEffect(() => {
    if (setLocalResize) setLocalResize();
  }, [bond]);

  // tx to submit
  const getTx = () => {
    let tx = null;
    if (!bondValid || !api || !activeAccount) {
      return tx;
    }

    // convert to submittable string
    const bondToSubmit = bondAfterTxFees.toString();

    // determine tx
    if (isPooling) {
      tx = api.tx.nominationPools.bondExtra({ FreeBalance: bondToSubmit });
    } else if (isStaking) {
      tx = api.tx.staking.bondExtra(bondToSubmit);
    }
    return tx;
  };

  const { submitTx, submitting } = useSubmitExtrinsic({
    tx: getTx(),
    from: activeAccount,
    shouldSubmit: bondValid,
    callbackSubmit: () => {
      setModalStatus(2);
    },
    callbackInBlock: () => {},
  });

  return (
    <>
      <div className="items">
        <>
          {!accountHasSigner(activeAccount) && (
            <Warning text={t('read_only')} />
          )}
          {freeBalance === 0 && (
            <Warning text={`${t('no_free_to_bond', { unit })}`} />
          )}
          {unclaimedRewards > 0 && bondType === 'pool' && (
            <Warning
              text={`${t('bonding_withdraw')} ${unclaimedRewards} ${unit}.`}
            />
          )}
          <h4>{t('amount_to_bond')}</h4>
          <h2>
            {largestTxFee.eq(new BN(0))
              ? '...'
              : `${planckBnToUnit(bondAfterTxFees, units)} ${unit}`}
          </h2>
          <p>{t('added_to_bond', { unit })}</p>
          <Separator />
          <h4>{t('new_total_bond')}</h4>
          <h2>
            {largestTxFee.eq(new BN(0))
              ? '...'
              : `${totalPossibleBond} ${network.unit}`}
          </h2>
          <Separator />
          <EstimatedTxFee />
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
