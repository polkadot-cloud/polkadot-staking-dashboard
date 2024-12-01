// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { planckToUnit, unitToPlanck } from '@w3ux/utils';
import { PoolBondExtra } from 'api/tx/poolBondExtra';
import { StakingBondExtra } from 'api/tx/stakingBondExtra';
import BigNumber from 'bignumber.js';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useNetwork } from 'contexts/Network';
import { useActivePool } from 'contexts/Pools/ActivePool';
import { useTransferOptions } from 'contexts/TransferOptions';
import { useBondGreatestFee } from 'hooks/useBondGreatestFee';
import { useSignerWarnings } from 'hooks/useSignerWarnings';
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic';
import { useOverlay } from 'kits/Overlay/Provider';
import { ModalPadding } from 'kits/Overlay/structure/ModalPadding';
import { ModalWarnings } from 'kits/Overlay/structure/ModalWarnings';
import { BondFeedback } from 'library/Form/Bond/BondFeedback';
import { Warning } from 'library/Form/Warning';
import { Close } from 'library/Modal/Close';
import { SubmitTx } from 'library/SubmitTx';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { planckToUnitBn } from 'utils';

export const Bond = () => {
  const { t } = useTranslation('modals');
  const {
    network,
    networkData: { units, unit },
  } = useNetwork();
  const { activeAccount } = useActiveAccounts();
  const { activePool } = useActivePool();
  const { getSignerWarnings } = useSignerWarnings();
  const { feeReserve, getTransferOptions } = useTransferOptions();
  const {
    setModalStatus,
    config: { options },
    setModalResize,
  } = useOverlay().modal;

  const { bondFor } = options;
  const isStaking = bondFor === 'nominator';
  const isPooling = bondFor === 'pool';
  const { nominate, transferrableBalance } = getTransferOptions(activeAccount);

  const freeToBond = planckToUnitBn(
    (bondFor === 'nominator'
      ? nominate.totalAdditionalBond
      : transferrableBalance
    ).minus(feeReserve),
    units
  );

  const largestTxFee = useBondGreatestFee({ bondFor });

  // Format unclaimed pool rewards.
  const pendingRewards = activePool?.pendingRewards || 0;
  const pendingRewardsUnit = planckToUnit(pendingRewards, units);

  // local bond value.
  const [bond, setBond] = useState<{ bond: string }>({
    bond: freeToBond.toString(),
  });

  // bond valid.
  const [bondValid, setBondValid] = useState<boolean>(false);

  // feedback errors to trigger modal resize
  const [feedbackErrors, setFeedbackErrors] = useState<string[]>([]);

  // handler to set bond as a string
  const handleSetBond = (newBond: { bond: BigNumber }) => {
    setBond({ bond: newBond.bond.toString() });
  };

  // bond minus tx fees.
  const enoughToCoverTxFees: boolean = freeToBond
    .minus(bond.bond)
    .isGreaterThan(planckToUnitBn(largestTxFee, units));

  // bond value after max tx fees have been deducated.
  let bondAfterTxFees: BigNumber;

  if (enoughToCoverTxFees) {
    bondAfterTxFees = new BigNumber(unitToPlanck(bond.bond, units).toString());
  } else {
    bondAfterTxFees = BigNumber.max(
      new BigNumber(unitToPlanck(String(bond.bond), units).toString()).minus(
        largestTxFee
      ),
      0
    );
  }

  // determine whether this is a pool or staking transaction.
  const determineTx = (bondToSubmit: BigNumber) => {
    let tx = null;
    const bondAsString = !bondValid
      ? '0'
      : bondToSubmit.isNaN()
        ? '0'
        : bondToSubmit.toString();

    if (isPooling) {
      tx = new PoolBondExtra(network, 'FreeBalance', BigInt(bondAsString)).tx();
    } else if (isStaking) {
      tx = new StakingBondExtra(network, BigInt(bondAsString)).tx();
    }
    return tx;
  };

  // the actual bond tx to submit
  const getTx = (bondToSubmit: BigNumber) => {
    if (!activeAccount) {
      return null;
    }
    return determineTx(bondToSubmit);
  };

  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(bondAfterTxFees),
    from: activeAccount,
    shouldSubmit: bondValid,
    callbackSubmit: () => {
      setModalStatus('closing');
    },
  });

  const warnings = getSignerWarnings(
    activeAccount,
    false,
    submitExtrinsic.proxySupported
  );

  // update bond value on task change.
  useEffect(() => {
    handleSetBond({ bond: freeToBond });
  }, [freeToBond.toString()]);

  // modal resize on form update
  useEffect(
    () => setModalResize(),
    [bond, bondValid, feedbackErrors.length, warnings.length]
  );

  return (
    <>
      <Close />
      <ModalPadding>
        <h2 className="title unbounded">{t('addToBond')}</h2>
        {pendingRewards > 0n && bondFor === 'pool' ? (
          <ModalWarnings withMargin>
            <Warning
              text={`${t('bondingWithdraw')} ${pendingRewardsUnit} ${unit}.`}
            />
          </ModalWarnings>
        ) : null}
        <BondFeedback
          syncing={largestTxFee.isZero()}
          bondFor={bondFor}
          listenIsValid={(valid, errors) => {
            setBondValid(valid);
            setFeedbackErrors(errors);
          }}
          defaultBond={null}
          setters={[handleSetBond]}
          parentErrors={warnings}
          txFees={BigInt(largestTxFee.toString())}
        />
        <p>{t('newlyBondedFunds')}</p>
      </ModalPadding>
      <SubmitTx valid={bondValid} {...submitExtrinsic} />
    </>
  );
};
