// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faArrowAltCircleUp } from '@fortawesome/free-solid-svg-icons';
import { ButtonSubmit } from '@rossbulat/polkadot-dashboard-ui';
import BigNumber from 'bignumber.js';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useTransferOptions } from 'contexts/TransferOptions';
import { useTxFees } from 'contexts/TxFees';
import { BondFeedback } from 'library/Form/Bond/BondFeedback';
import { Warning } from 'library/Form/Warning';
import { useBondGreatestFee } from 'library/Hooks/useBondGreatestFee';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { Close } from 'library/Modal/Close';
import { SubmitTx } from 'library/SubmitTx';
import { PaddingWrapper } from 'modals/Wrappers';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { planckToUnit, unitToPlanck } from 'Utils';

export const Bond = () => {
  const { t } = useTranslation('modals');
  const { api, network } = useApi();
  const { units } = network;
  const { setStatus: setModalStatus, config, setResize } = useModal();
  const { activeAccount, accountHasSigner } = useConnect();
  const { getTransferOptions } = useTransferOptions();
  const { txFeesValid } = useTxFees();
  const { selectedActivePool } = useActivePools();
  const { bondFor } = config;
  const isStaking = bondFor === 'nominator';
  const isPooling = bondFor === 'pool';
  const { freeBalance: freeBalanceBn } = getTransferOptions(activeAccount);
  const freeBalance = planckToUnit(freeBalanceBn, units);
  const largestTxFee = useBondGreatestFee({ bondFor });

  // calculate any unclaimed pool rewards.
  let { unclaimedRewards } = selectedActivePool || {};
  unclaimedRewards = unclaimedRewards ?? new BigNumber(0);
  unclaimedRewards = planckToUnit(unclaimedRewards, network.units);

  // local bond value.
  const [bond, setBond] = useState<{ bond: string }>({
    bond: freeBalance.toString(),
  });

  // bond valid.
  const [bondValid, setBondValid] = useState<boolean>(false);

  // bond minus tx fees.
  const enoughToCoverTxFees: boolean = freeBalance
    .minus(new BigNumber(bond.bond))
    .isGreaterThan(planckToUnit(largestTxFee, units));

  // bond value after max tx fees have been deducated.
  let bondAfterTxFees: BigNumber;

  if (enoughToCoverTxFees) {
    bondAfterTxFees = unitToPlanck(String(bond.bond), units);
  } else {
    bondAfterTxFees = BigNumber.max(
      unitToPlanck(String(bond.bond), units).minus(largestTxFee),
      new BigNumber(0)
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

    const bondAsString = bondToSubmit.isNaN() ? '0' : bondToSubmit.toString();

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
    if (!bondValid || !activeAccount) {
      return null;
    }
    return determineTx(bondToSubmit);
  };

  const { submitTx, submitting } = useSubmitExtrinsic({
    tx: getTx(bondAfterTxFees),
    from: activeAccount,
    shouldSubmit: bondValid,
    callbackSubmit: () => {
      setModalStatus(2);
    },
    callbackInBlock: () => {},
  });

  const errors = [];
  if (!accountHasSigner(activeAccount)) {
    errors.push(t('readOnly'));
  }

  return (
    <>
      <Close />
      <PaddingWrapper>
        {unclaimedRewards > 0 && bondFor === 'pool' && (
          <Warning
            text={`${t('bondingWithdraw')} ${unclaimedRewards} ${
              network.unit
            }.`}
          />
        )}
        <h2 className="title unbounded">{t('addToBond')}</h2>
        <BondFeedback
          syncing={largestTxFee.isEqualTo(new BigNumber(0))}
          bondFor={bondFor}
          listenIsValid={setBondValid}
          defaultBond={null}
          setters={[
            {
              set: setBond,
              current: bond,
            },
          ]}
          parentErrors={errors}
          txFees={largestTxFee}
        />
        <p>
          Newly boned funds will back active nominations from the start of the
          next era.
        </p>
      </PaddingWrapper>
      <SubmitTx
        buttons={[
          <ButtonSubmit
            key="button_submit"
            text={`${submitting ? t('submitting') : t('submit')}`}
            iconLeft={faArrowAltCircleUp}
            iconTransform="grow-2"
            onClick={() => submitTx()}
            disabled={
              submitting ||
              !(bondValid && accountHasSigner(activeAccount) && txFeesValid)
            }
          />,
        ]}
      />
    </>
  );
};
