// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  faArrowAltCircleUp,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';
import { ButtonSubmit } from '@rossbulat/polkadot-dashboard-ui';
import BigNumber from 'bignumber.js';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useTransferOptions } from 'contexts/TransferOptions';
import { useTxFees } from 'contexts/TxFees';
import { EstimatedTxFee } from 'library/EstimatedTxFee';
import { Warning } from 'library/Form/Warning';
import { useErasToTimeLeft } from 'library/Hooks/useErasToTimeLeft';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { timeleftAsString } from 'library/Hooks/useTimeLeft/utils';
import { Title } from 'library/Modal/Title';
import {
  FooterWrapper,
  NotesWrapper,
  PaddingWrapper,
  WarningsWrapper,
} from 'modals/Wrappers';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { greaterThanZero, planckToUnit, unitToPlanck } from 'Utils';
import { Separator } from '../../Wrappers';

export const LeavePool = () => {
  const { t } = useTranslation('modals');
  const { api, network, consts } = useApi();
  const { units } = network;
  const { setStatus: setModalStatus, setResize } = useModal();
  const { activeAccount, accountHasSigner } = useConnect();
  const { getTransferOptions } = useTransferOptions();
  const { txFeesValid } = useTxFees();
  const { selectedActivePool } = useActivePools();
  const { erasToSeconds } = useErasToTimeLeft();

  const allTransferOptions = getTransferOptions(activeAccount);
  const { active: activeBn } = allTransferOptions.pool;
  const { bondDuration } = consts;

  const bondDurationFormatted = timeleftAsString(
    t,
    erasToSeconds(bondDuration),
    true
  );

  let { unclaimedRewards } = selectedActivePool || {};
  unclaimedRewards = unclaimedRewards ?? new BigNumber(0);
  unclaimedRewards = planckToUnit(unclaimedRewards, network.units);

  // convert BigNumber values to number
  const freeToUnbond = planckToUnit(activeBn, units);

  // local bond value
  const [bond, setBond] = useState<{ bond: string }>({
    bond: freeToUnbond.toString(),
  });

  // bond valid
  const [bondValid, setBondValid] = useState(false);

  // unbond all validation
  const isValid = (() => {
    return greaterThanZero(freeToUnbond);
  })();

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
      <Title title={t('leavePool')} icon={faSignOutAlt} />
      <PaddingWrapper>
        {!accountHasSigner(activeAccount) && <Warning text={t('readOnly')} />}
        {unclaimedRewards > 0 && (
          <WarningsWrapper>
            <Warning
              text={`${t('unbondingWithdraw')} ${unclaimedRewards} ${
                network.unit
              }.`}
            />
          </WarningsWrapper>
        )}
        <h2 className="title">
          {`${t('unbond')} ${freeToUnbond} ${network.unit}`}
        </h2>
        <Separator />
        <NotesWrapper>
          <p>{t('onceUnbonding', { bondDurationFormatted })}</p>
          {bondValid && <EstimatedTxFee />}
        </NotesWrapper>
        <FooterWrapper>
          <div>
            <ButtonSubmit
              text={`${submitting ? t('submitting') : t('submit')}`}
              iconLeft={faArrowAltCircleUp}
              iconTransform="grow-2"
              onClick={() => submitTx()}
              disabled={
                submitting ||
                !(bondValid && accountHasSigner(activeAccount) && txFeesValid)
              }
            />
          </div>
        </FooterWrapper>
      </PaddingWrapper>
    </>
  );
};
