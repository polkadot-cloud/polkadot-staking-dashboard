// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { planckToUnit, unitToPlanck } from '@polkadot-cloud/utils';
import BigNumber from 'bignumber.js';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { usePoolsConfig } from 'contexts/Pools/PoolsConfig';
import { useStaking } from 'contexts/Staking';
import { useTransferOptions } from 'contexts/TransferOptions';
import { useNetwork } from 'contexts/Network';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { Warning } from '../Warning';
import { Spacer } from '../Wrappers';
import type { BondFeedbackProps } from '../types';
import { BondInput } from './BondInput';

export const BondFeedback = ({
  bondFor,
  inSetup = false,
  joiningPool = false,
  parentErrors = [],
  setters = [],
  listenIsValid = () => {},
  disableTxFeeUpdate = false,
  defaultBond,
  txFees,
  maxWidth,
  syncing = false,
}: BondFeedbackProps) => {
  const { t } = useTranslation('library');
  const {
    networkData: { units, unit },
  } = useNetwork();
  const { staking } = useStaking();
  const { activeAccount } = useActiveAccounts();
  const { stats } = usePoolsConfig();
  const { isDepositor } = useActivePools();
  const { getTransferOptions } = useTransferOptions();
  const { minJoinBond, minCreateBond } = stats;
  const { minNominatorBond } = staking;
  const allTransferOptions = getTransferOptions(activeAccount);

  const defaultBondStr = defaultBond ? String(defaultBond) : '';

  // get bond options for either staking or pooling.
  const availableBalance =
    bondFor === 'nominator'
      ? allTransferOptions.nominate.totalAdditionalBond
      : allTransferOptions.transferrableBalance;

  // the default bond balance. If we are bonding, subtract tx fees from bond amount.
  const freeToBond = !disableTxFeeUpdate
    ? BigNumber.max(availableBalance.minus(txFees), 0)
    : availableBalance;

  // store errors
  const [errors, setErrors] = useState<string[]>([]);

  // local bond state
  const [bond, setBond] = useState<{ bond: string }>({
    bond: defaultBondStr,
  });

  // current bond value BigNumber
  const bondBn = unitToPlanck(bond.bond, units);

  // whether bond is disabled
  const [bondDisabled, setBondDisabled] = useState(false);

  // bond minus tx fees if too much
  const enoughToCoverTxFees = freeToBond.minus(bondBn).isGreaterThan(txFees);

  const bondAfterTxFees = enoughToCoverTxFees
    ? bondBn
    : BigNumber.max(bondBn.minus(txFees), 0);

  // update bond on account change
  useEffect(() => {
    setBond({
      bond: defaultBondStr,
    });
  }, [activeAccount]);

  // handle errors on input change
  useEffect(() => {
    handleErrors();
  }, [bond, txFees]);

  // update max bond after txFee sync
  useEffect(() => {
    if (!disableTxFeeUpdate) {
      if (bondBn.isGreaterThan(freeToBond)) {
        setBond({ bond: String(freeToBond) });
      }
    }
  }, [txFees]);

  // add this component's setBond to setters
  setters.push({
    set: setBond,
    current: bond,
  });

  // bond amount to minimum threshold.
  const minBondBn =
    bondFor === 'pool'
      ? inSetup || isDepositor()
        ? minCreateBond
        : minJoinBond
      : minNominatorBond;
  const minBondUnit = planckToUnit(minBondBn, units);

  // handle error updates
  const handleErrors = () => {
    let disabled = false;
    const newErrors = parentErrors;
    const decimals = bond.bond.toString().split('.')[1]?.length ?? 0;

    // bond errors
    if (freeToBond.isZero()) {
      disabled = true;
      newErrors.push(`${t('noFree', { unit })}`);
    }

    // bond amount must not surpass freeBalalance
    if (bondBn.isGreaterThan(freeToBond)) {
      newErrors.push(t('moreThanBalance'));
    }

    // bond amount must not be smaller than 1 planck
    if (bond.bond !== '' && bondBn.isLessThan(1)) {
      newErrors.push(t('tooSmall'));
    }

    // check bond after transaction fees is still valid
    if (bond.bond !== '' && bondAfterTxFees.isLessThan(0)) {
      newErrors.push(`${t('notEnoughAfter', { unit })}`);
    }

    // cbond amount must not surpass network supported units
    if (decimals > units) {
      newErrors.push(`${t('bondDecimalsError', { units })}`);
    }

    if (inSetup || joiningPool) {
      if (freeToBond.isLessThan(minBondBn)) {
        disabled = true;
        newErrors.push(`${t('notMeet')} ${minBondUnit} ${unit}.`);
      }
      // bond amount must be more than minimum required bond
      if (bond.bond !== '' && bondBn.isLessThan(minBondBn)) {
        newErrors.push(`${t('atLeast')} ${minBondUnit} ${unit}.`);
      }
    }

    const bondValid = !newErrors.length && bond.bond !== '';
    setBondDisabled(disabled);
    listenIsValid(bondValid, newErrors);
    setErrors(newErrors);
  };

  return (
    <>
      {errors.map((err, i) => (
        <Warning key={`setup_error_${i}`} text={err} />
      ))}
      <Spacer />
      <div
        style={{
          width: '100%',
          maxWidth: maxWidth ? '500px' : '100%',
        }}
      >
        <BondInput
          value={String(bond.bond)}
          defaultValue={defaultBondStr}
          syncing={syncing}
          disabled={bondDisabled}
          setters={setters}
          freeToBond={planckToUnit(freeToBond, units)}
          disableTxFeeUpdate={disableTxFeeUpdate}
        />
      </div>
    </>
  );
};
