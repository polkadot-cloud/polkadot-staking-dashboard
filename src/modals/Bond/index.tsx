// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ModalPadding, ModalWarnings } from '@polkadotcloud/core-ui';
import { planckToUnit, unitToPlanck } from '@polkadotcloud/utils';
import BigNumber from 'bignumber.js';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useTransferOptions } from 'contexts/TransferOptions';
import { BondFeedback } from 'library/Form/Bond/BondFeedback';
import { Warning } from 'library/Form/Warning';
import { useBondGreatestFee } from 'library/Hooks/useBondGreatestFee';
import { useSignerWarnings } from 'library/Hooks/useSignerWarnings';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { Close } from 'library/Modal/Close';
import { SubmitTx } from 'library/SubmitTx';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const Bond = () => {
  const { t } = useTranslation('modals');
  const { api, network } = useApi();
  const { units } = network;
  const { setStatus: setModalStatus, config, setResize } = useModal();
  const { activeAccount } = useConnect();
  const { reserve, getTransferOptions } = useTransferOptions();
  const { selectedActivePool } = useActivePools();
  const { getSignerWarnings } = useSignerWarnings();
  const { bondFor } = config;
  const isStaking = bondFor === 'nominator';
  const isPooling = bondFor === 'pool';
  const { nominate, pool } = getTransferOptions(activeAccount);

  const freeBalanceBn =
    bondFor === 'nominator'
      ? nominate.totalAdditionalBond
      : pool.totalAdditionalBond;

  const freeBalance = planckToUnit(freeBalanceBn.minus(reserve), units);
  const largestTxFee = useBondGreatestFee({ bondFor });

  // calculate any unclaimed pool rewards.
  let { pendingRewards } = selectedActivePool || {};
  pendingRewards = pendingRewards ?? new BigNumber(0);
  pendingRewards = planckToUnit(pendingRewards, network.units);

  // local bond value.
  const [bond, setBond] = useState<{ bond: string }>({
    bond: freeBalance.toString(),
  });

  // bond valid.
  const [bondValid, setBondValid] = useState<boolean>(false);

  // bond minus tx fees.
  const enoughToCoverTxFees: boolean = freeBalance
    .minus(bond.bond)
    .isGreaterThan(planckToUnit(largestTxFee, units));

  // bond value after max tx fees have been deducated.
  let bondAfterTxFees: BigNumber;

  if (enoughToCoverTxFees) {
    bondAfterTxFees = unitToPlanck(String(bond.bond), units);
  } else {
    bondAfterTxFees = BigNumber.max(
      unitToPlanck(String(bond.bond), units).minus(largestTxFee),
      0
    );
  }

  // update bond value on task change.
  useEffect(() => {
    setBond({ bond: freeBalance.toString() });
  }, [freeBalance.toString()]);

  // modal resize on form update
  useEffect(() => {
    setResize();
  }, [bond]);

  // determine whether this is a pool or staking transaction.
  const determineTx = (bondToSubmit: BigNumber) => {
    let tx = null;
    if (!api) {
      return tx;
    }

    const bondAsString = !bondValid
      ? '0'
      : bondToSubmit.isNaN()
      ? '0'
      : bondToSubmit.toString();

    if (isPooling) {
      tx = api.tx.nominationPools.bondExtra({
        FreeBalance: bondAsString,
      });
    } else if (isStaking) {
      tx = api.tx.staking.bondExtra(bondAsString);
    }
    return tx;
  };

  // the actual bond tx to submit
  const getTx = (bondToSubmit: BigNumber) => {
    if (!api || !activeAccount) {
      return null;
    }
    return determineTx(bondToSubmit);
  };

  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(bondAfterTxFees),
    from: activeAccount,
    shouldSubmit: bondValid,
    callbackSubmit: () => {
      setModalStatus(2);
    },
    callbackInBlock: () => {},
  });

  const warnings = getSignerWarnings(
    activeAccount,
    false,
    submitExtrinsic.proxySupported
  );

  return (
    <>
      <Close />
      <ModalPadding>
        <h2 className="title unbounded">{t('addToBond')}</h2>
        {pendingRewards > 0 && bondFor === 'pool' ? (
          <ModalWarnings withMargin>
            <Warning
              text={`${t('bondingWithdraw')} ${pendingRewards} ${
                network.unit
              }.`}
            />
          </ModalWarnings>
        ) : null}
        <BondFeedback
          syncing={largestTxFee.isZero()}
          bondFor={bondFor}
          listenIsValid={setBondValid}
          defaultBond={null}
          setters={[
            {
              set: setBond,
              current: bond,
            },
          ]}
          parentErrors={warnings}
          txFees={largestTxFee}
        />
        <p>{t('newlyBondedFunds')}</p>
      </ModalPadding>
      <SubmitTx valid={bondValid} {...submitExtrinsic} />
    </>
  );
};
