// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faArrowAltCircleUp } from '@fortawesome/free-solid-svg-icons';
import { ButtonSubmit } from '@rossbulat/polkadot-dashboard-ui';
import { useApi } from 'contexts/Api';
import { useBalances } from 'contexts/Balances';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useStaking } from 'contexts/Staking';
import { useTransferOptions } from 'contexts/TransferOptions';
import { useTxFees } from 'contexts/TxFees';
import { Warning } from 'library/Form/Warning';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { Close } from 'library/Modal/Close';
import { SubmitTx } from 'library/SubmitTx';
import { PaddingWrapper } from 'modals/Wrappers';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { greaterThanZero, planckToUnit, unitToPlanck } from 'Utils';
import { Separator } from '../../Wrappers';

export const Unstake = () => {
  const { t } = useTranslation('modals');

  const { api, network, consts } = useApi();
  const { units } = network;
  const { setStatus: setModalStatus, setResize } = useModal();
  const { activeAccount, accountHasSigner } = useConnect();
  const { getControllerNotImported } = useStaking();
  const { getBondedAccount, getAccountNominations } = useBalances();
  const { getTransferOptions } = useTransferOptions();
  const { txFeesValid } = useTxFees();

  const controller = getBondedAccount(activeAccount);
  const nominations = getAccountNominations(activeAccount);
  const controllerNotImported = getControllerNotImported(controller);
  const { bondDuration } = consts;
  const allTransferOptions = getTransferOptions(activeAccount);
  const { active } = allTransferOptions.nominate;

  // convert BigNumber values to number
  const freeToUnbond = planckToUnit(active, units);

  // local bond value
  const [bond, setBond] = useState<{ bond: string }>({
    bond: freeToUnbond.toString(),
  });

  // bond valid
  const [bondValid, setBondValid] = useState(false);

  // unbond all validation
  const isValid = (() => {
    return greaterThanZero(freeToUnbond) && !controllerNotImported;
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

  const { submitTx, submitting } = useSubmitExtrinsic({
    tx: getTx(),
    from: controller,
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
        <h2 className="title unbounded">{t('unstake')} </h2>
        {!accountHasSigner(controller) && <Warning text={t('readOnly')} />}
        {controllerNotImported ? (
          <Warning text={t('controllerImported')} />
        ) : (
          <></>
        )}
        {greaterThanZero(freeToUnbond) ? (
          <h2 className="title">
            {t('unstakeUnbond', {
              bond: freeToUnbond.toFormat(),
              unit: network.unit,
            })}
          </h2>
        ) : null}
        <Separator />
        {nominations.length > 0 && (
          <>
            <h2 className="title">
              {t('unstakeStopNominating', { count: nominations.length })}
            </h2>
            <Separator />
          </>
        )}
        <p>{t('onceUnbonding', { bondDuration })}</p>
      </PaddingWrapper>
      <SubmitTx
        fromController
        buttons={[
          <ButtonSubmit
            key="button_submit"
            text={`${submitting ? t('submitting') : t('submit')}`}
            iconLeft={faArrowAltCircleUp}
            iconTransform="grow-2"
            onClick={() => submitTx()}
            disabled={
              submitting ||
              !(bondValid && accountHasSigner(controller) && txFeesValid)
            }
          />,
        ]}
      />
    </>
  );
};
