// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  greaterThanZero,
  planckToUnit,
  unitToPlanck,
} from '@polkadotcloud/utils';
import { useApi } from 'contexts/Api';
import { useBalances } from 'contexts/Balances';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useStaking } from 'contexts/Staking';
import { useTransferOptions } from 'contexts/TransferOptions';
import { getUnixTime } from 'date-fns';
import { Warning } from 'library/Form/Warning';
import { useErasToTimeLeft } from 'library/Hooks/useErasToTimeLeft';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { timeleftAsString } from 'library/Hooks/useTimeLeft/utils';
import { Action } from 'library/Modal/Action';
import { Close } from 'library/Modal/Close';
import { SubmitTx } from 'library/SubmitTx';
import { StaticNote } from 'modals/Utils/StaticNote';
import { PaddingWrapper, WarningsWrapper } from 'modals/Wrappers';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const Unstake = () => {
  const { t } = useTranslation('modals');
  const { api, network, consts } = useApi();
  const { units } = network;
  const { setStatus: setModalStatus, setResize } = useModal();
  const { activeAccount, accountHasSigner } = useConnect();
  const { getControllerNotImported } = useStaking();
  const { getBondedAccount, getAccountNominations } = useBalances();
  const { getTransferOptions } = useTransferOptions();
  const { erasToSeconds } = useErasToTimeLeft();

  const controller = getBondedAccount(activeAccount);
  const nominations = getAccountNominations(activeAccount);
  const controllerNotImported = getControllerNotImported(controller);
  const { bondDuration } = consts;
  const allTransferOptions = getTransferOptions(activeAccount);
  const { active } = allTransferOptions.nominate;

  const bondDurationFormatted = timeleftAsString(
    t,
    getUnixTime(new Date()) + 1,
    erasToSeconds(bondDuration),
    true
  );

  // convert BigNumber values to number
  const freeToUnbond = planckToUnit(active, units);

  // local bond value
  const [bond, setBond] = useState<{ bond: string }>({
    bond: freeToUnbond.toString(),
  });

  // bond valid
  const [bondValid, setBondValid] = useState(false);

  // unbond all validation
  const isValid = (() =>
    greaterThanZero(freeToUnbond) && !controllerNotImported)();

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
    const tx = null;
    if (!bondValid || !api || !activeAccount) {
      return tx;
    }
    // controller must be imported to unstake
    if (controllerNotImported) {
      return tx;
    }
    // remove decimal errors
    const bondToSubmit = unitToPlanck(String(bond.bond), units);
    const bondAsString = bondToSubmit.isNaN() ? '0' : bondToSubmit.toString();

    if (!bondAsString) {
      return api.tx.staking.chill();
    }
    const txs = [api.tx.staking.chill(), api.tx.staking.unbond(bondAsString)];
    return api.tx.utility.batch(txs);
  };

  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: controller,
    shouldSubmit: bondValid,
    callbackSubmit: () => {
      setModalStatus(2);
    },
    callbackInBlock: () => {},
  });

  const warnings = [];
  if (!accountHasSigner(controller)) {
    warnings.push(<Warning text={t('readOnlyCannotSign')} />);
  }
  if (controllerNotImported) {
    warnings.push(<Warning text={t('controllerImported')} />);
  }

  return (
    <>
      <Close />
      <PaddingWrapper>
        <h2 className="title unbounded">{t('unstake')} </h2>
        {warnings.length ? (
          <WarningsWrapper>
            {warnings.map((warning: React.ReactNode, index: number) => (
              <React.Fragment key={`warning_${index}`}>
                {warning}
              </React.Fragment>
            ))}
          </WarningsWrapper>
        ) : null}
        {greaterThanZero(freeToUnbond) ? (
          <Action
            text={t('unstakeUnbond', {
              bond: freeToUnbond.toFormat(),
              unit: network.unit,
            })}
          />
        ) : null}
        {nominations.length > 0 && (
          <Action
            text={t('unstakeStopNominating', { count: nominations.length })}
          />
        )}
        <StaticNote
          value={bondDurationFormatted}
          tKey="onceUnbonding"
          valueKey="bondDurationFormatted"
          deps={[bondDuration]}
        />
      </PaddingWrapper>
      <SubmitTx fromController valid={bondValid} {...submitExtrinsic} />
    </>
  );
};
