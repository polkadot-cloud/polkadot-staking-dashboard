// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ActionItem } from '@polkadotcloud/core-ui';
import {
  greaterThanZero,
  planckToUnit,
  unitToPlanck,
} from '@polkadotcloud/utils';
import BigNumber from 'bignumber.js';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useTransferOptions } from 'contexts/TransferOptions';
import { getUnixTime } from 'date-fns';
import { Warning } from 'library/Form/Warning';
import { useErasToTimeLeft } from 'library/Hooks/useErasToTimeLeft';
import { useSignerWarnings } from 'library/Hooks/useSignerWarnings';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { timeleftAsString } from 'library/Hooks/useTimeLeft/utils';
import { Close } from 'library/Modal/Close';
import { SubmitTx } from 'library/SubmitTx';
import { StaticNote } from 'modals/Utils/StaticNote';
import { PaddingWrapper, WarningsWrapper } from 'modals/Wrappers';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const LeavePool = () => {
  const { t } = useTranslation('modals');
  const { api, network, consts } = useApi();
  const { activeAccount } = useConnect();
  const { units } = network;
  const { setStatus: setModalStatus, setResize } = useModal();
  const { getTransferOptions } = useTransferOptions();
  const { selectedActivePool } = useActivePools();
  const { erasToSeconds } = useErasToTimeLeft();
  const { getSignerWarnings } = useSignerWarnings();

  const allTransferOptions = getTransferOptions(activeAccount);
  const { active: activeBn } = allTransferOptions.pool;
  const { bondDuration } = consts;

  const bondDurationFormatted = timeleftAsString(
    t,
    getUnixTime(new Date()) + 1,
    erasToSeconds(bondDuration),
    true
  );

  let { pendingRewards } = selectedActivePool || {};
  pendingRewards = pendingRewards ?? new BigNumber(0);
  pendingRewards = planckToUnit(pendingRewards, network.units);

  // convert BigNumber values to number
  const freeToUnbond = planckToUnit(activeBn, units);

  // local bond value
  const [bond, setBond] = useState<{ bond: string }>({
    bond: freeToUnbond.toString(),
  });

  // bond valid
  const [bondValid, setBondValid] = useState(false);

  // unbond all validation
  const isValid = (() => greaterThanZero(freeToUnbond))();

  // update bond value on task change
  useEffect(() => {
    setBond({ bond: freeToUnbond.toString() });
    setBondValid(isValid);
  }, [freeToUnbond.toString(), isValid]);

  // modal resize on form update
  useEffect(() => {
    setResize();
  }, [bond]);

  // tx to submit
  const getTx = () => {
    let tx = null;
    if (!bondValid || !api || !activeAccount) {
      return tx;
    }

    const bondToSubmit = unitToPlanck(bond.bond, units);
    const bondAsString = bondToSubmit.isNaN() ? '0' : bondToSubmit.toString();
    tx = api.tx.nominationPools.unbond(activeAccount, bondAsString);
    return tx;
  };

  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: activeAccount,
    shouldSubmit: bondValid,
    callbackSubmit: () => {
      setModalStatus(2);
    },
    callbackInBlock: () => {},
  });

  const warnings = getSignerWarnings(activeAccount, false);

  if (greaterThanZero(pendingRewards)) {
    warnings.push(
      `${t('unbondingWithdraw')} ${pendingRewards.toString()} ${network.unit}.`
    );
  }

  return (
    <>
      <Close />
      <PaddingWrapper>
        <h2 className="title unbounded">{t('leavePool')}</h2>
        {warnings.length > 0 ? (
          <WarningsWrapper>
            {warnings.map((text, i) => (
              <Warning key={`warning${i}`} text={text} />
            ))}
          </WarningsWrapper>
        ) : null}
        <ActionItem text={`${t('unbond')} ${freeToUnbond} ${network.unit}`} />
        <StaticNote
          value={bondDurationFormatted}
          tKey="onceUnbonding"
          valueKey="bondDurationFormatted"
          deps={[bondDuration]}
        />
      </PaddingWrapper>
      <SubmitTx valid={bondValid} {...submitExtrinsic} />
    </>
  );
};
