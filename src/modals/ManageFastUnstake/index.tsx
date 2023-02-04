// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons';
import { faBolt } from '@fortawesome/free-solid-svg-icons';
import { ButtonSubmit } from '@rossbulat/polkadot-dashboard-ui';
import { useApi } from 'contexts/Api';
import { useBalances } from 'contexts/Balances';
import { useConnect } from 'contexts/Connect';
import { useFastUnstake } from 'contexts/FastUnstake';
import { useModal } from 'contexts/Modal';
import { useNetworkMetrics } from 'contexts/Network';
import { useStaking } from 'contexts/Staking';
import { useTransferOptions } from 'contexts/TransferOptions';
import { useTxFees } from 'contexts/TxFees';
import { Warning } from 'library/Form/Warning';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { useUnstaking } from 'library/Hooks/useUnstaking';
import { Title } from 'library/Modal/Title';
import { SubmitTx } from 'library/SubmitTx';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { planckToUnit } from 'Utils';
import {
  NotesWrapper,
  PaddingWrapper,
  Separator,
  WarningsWrapper,
} from '../Wrappers';

export const ManageFastUnstake = () => {
  const { t } = useTranslation('modals');
  const { api, consts, network } = useApi();
  const { activeAccount } = useConnect();
  const { getControllerNotImported } = useStaking();
  const { getBondedAccount } = useBalances();
  const { txFeesValid } = useTxFees();
  const { activeEra, metrics } = useNetworkMetrics();
  const { isExposed, counterForQueue, queueDeposit, meta } = useFastUnstake();
  const { setResize, setStatus } = useModal();
  const { getTransferOptions } = useTransferOptions();
  const { isFastUnstaking } = useUnstaking();

  const { bondDuration, fastUnstakeDeposit } = consts;
  const { fastUnstakeErasToCheckPerBlock } = metrics;
  const { checked } = meta;
  const controller = getBondedAccount(activeAccount);
  const allTransferOptions = getTransferOptions(activeAccount);
  const { nominate, freeBalance } = allTransferOptions;
  const { totalUnlockChuncks } = nominate;

  // valid to submit transaction
  const [valid, setValid] = useState<boolean>(false);

  useEffect(() => {
    setValid(
      fastUnstakeErasToCheckPerBlock > 0 &&
        ((!isFastUnstaking &&
          freeBalance.isGreaterThanOrEqualTo(fastUnstakeDeposit) &&
          isExposed === false &&
          totalUnlockChuncks === 0) ||
          isFastUnstaking)
    );
  }, [
    isExposed,
    fastUnstakeErasToCheckPerBlock,
    totalUnlockChuncks,
    isFastUnstaking,
    fastUnstakeDeposit,
    freeBalance,
  ]);

  useEffect(() => {
    setResize();
  }, [isExposed, queueDeposit, isFastUnstaking]);

  // tx to submit
  const getTx = () => {
    let tx = null;
    if (!valid || !api) {
      return tx;
    }
    if (!isFastUnstaking) {
      tx = api.tx.fastUnstake.registerFastUnstake();
    } else {
      tx = api.tx.fastUnstake.deregister();
    }
    return tx;
  };

  const { submitTx, submitting } = useSubmitExtrinsic({
    tx: getTx(),
    from: controller,
    shouldSubmit: valid,
    callbackSubmit: () => {},
    callbackInBlock: () => {
      setStatus(2);
    },
  });

  // warnings
  const warnings = [];
  if (getControllerNotImported(controller)) {
    warnings.push(t('mustHaveController'));
  }
  if (!isFastUnstaking) {
    if (freeBalance.isLessThan(fastUnstakeDeposit)) {
      warnings.push(
        `${t('noEnough')} ${planckToUnit(
          fastUnstakeDeposit,
          network.units
        ).toString()} ${network.unit}`
      );
    }

    if (totalUnlockChuncks > 0) {
      warnings.push(
        `${t('fastUnstakeWarningUnlocksActive', {
          count: totalUnlockChuncks,
        })} ${t('fastUnstakeWarningUnlocksActiveMore')}`
      );
    }
  }

  // manage last exposed
  let lastExposedAgo = 0;
  if (isExposed) {
    lastExposedAgo = activeEra.index - (checked[0] || 0);
  }
  const erasRemaining = Math.max(1, bondDuration - lastExposedAgo);

  return (
    <>
      <Title title={t('fastUnstake', { context: 'title' })} icon={faBolt} />
      <PaddingWrapper>
        {warnings.length > 0 ? (
          <WarningsWrapper>
            {warnings.map((text: any, index: number) => (
              <Warning key={index} text={text} />
            ))}
          </WarningsWrapper>
        ) : null}

        {isExposed ? (
          <>
            <h2 className="title">
              {t('fastUnstakeExposedAgo', { count: lastExposedAgo })}
            </h2>
            <Separator />
            <NotesWrapper>
              <p>{t('fastUnstakeNote1', { bondDuration })}</p>
              <p>{t('fastUnstakeNote2', { count: erasRemaining })}</p>
            </NotesWrapper>
          </>
        ) : (
          <>
            {!isFastUnstaking ? (
              <>
                <h2 className="title">
                  {t('fastUnstake', { context: 'register' })}
                </h2>
                <Separator />
                <NotesWrapper>
                  <p>
                    <>
                      {t('registerFastUnstake')}{' '}
                      {planckToUnit(
                        fastUnstakeDeposit,
                        network.units
                      ).toString()}{' '}
                      {network.unit}. {t('fastUnstakeOnceRegistered')}
                    </>
                  </p>
                  <p>
                    {t('fastUnstakeCurrentQueue')}: <b>{counterForQueue}</b>
                  </p>
                </NotesWrapper>
              </>
            ) : (
              <>
                <h2 className="title">{t('fastUnstakeRegistered')}</h2>
                <Separator />
                <NotesWrapper>
                  <p>
                    {t('fastUnstakeCurrentQueue')}: <b>{counterForQueue}</b>
                  </p>
                  <p>{t('fastUnstakeUnorderedNote')}</p>
                </NotesWrapper>
              </>
            )}
          </>
        )}
      </PaddingWrapper>
      {!isExposed ? (
        <SubmitTx
          fromController
          buttons={[
            <ButtonSubmit
              text={`${
                submitting
                  ? t('submitting')
                  : t('fastUnstakeSubmit', {
                      context: isFastUnstaking ? 'cancel' : 'register',
                    })
              }`}
              iconLeft={faArrowAltCircleUp}
              iconTransform="grow-2"
              onClick={() => submitTx()}
              disabled={!valid || submitting || !txFeesValid}
            />,
          ]}
        />
      ) : null}
    </>
  );
};
