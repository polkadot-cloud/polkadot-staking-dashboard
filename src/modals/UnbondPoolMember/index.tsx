// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faArrowAltCircleUp } from '@fortawesome/free-solid-svg-icons';
import { ButtonSubmit } from '@rossbulat/polkadot-dashboard-ui';
import BigNumber from 'bignumber.js';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useTxFees } from 'contexts/TxFees';
import { Warning } from 'library/Form/Warning';
import { useErasToTimeLeft } from 'library/Hooks/useErasToTimeLeft';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { timeleftAsString } from 'library/Hooks/useTimeLeft/utils';
import { Action } from 'library/Modal/Action';
import { Close } from 'library/Modal/Close';
import { SubmitTx } from 'library/SubmitTx';
import { PaddingWrapper, WarningsWrapper } from 'modals/Wrappers';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { greaterThanZero, planckToUnit, rmCommas, unitToPlanck } from 'Utils';

export const UnbondPoolMember = () => {
  const { t } = useTranslation('modals');
  const { api, network, consts } = useApi();
  const { setStatus: setModalStatus, setResize, config } = useModal();
  const { activeAccount, accountHasSigner } = useConnect();
  const { txFeesValid } = useTxFees();
  const { erasToSeconds } = useErasToTimeLeft();

  const { units } = network;
  const { bondDuration } = consts;
  const { member, who } = config;
  const { points } = member;
  const freeToUnbond = planckToUnit(new BigNumber(rmCommas(points)), units);

  const bondDurationFormatted = timeleftAsString(
    t,
    erasToSeconds(bondDuration),
    true
  );

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
    // remove decimal errors
    const bondToSubmit = unitToPlanck(bond.bond, units);
    const bondAsString = bondToSubmit.isNaN() ? '0' : bondToSubmit.toString();
    tx = api.tx.nominationPools.unbond(who, bondAsString);
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
      <Close />
      <PaddingWrapper>
        <h2 className="title unbounded">{t('unbondMemberFunds')}</h2>
        {!accountHasSigner(activeAccount) ? (
          <WarningsWrapper>
            <Warning text={t('readOnly')} />
          </WarningsWrapper>
        ) : null}
        <Action text={`${t('unbond')} ${freeToUnbond} ${network.unit}`} />
        <p>{t('onceUnbonding', { bondDurationFormatted })}</p>
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
              !bondValid ||
              !accountHasSigner(activeAccount) ||
              !txFeesValid
            }
          />,
        ]}
      />
    </>
  );
};
