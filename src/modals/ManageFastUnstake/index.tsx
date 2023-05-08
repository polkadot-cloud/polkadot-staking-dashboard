// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ActionItem } from '@polkadotcloud/core-ui';
import { planckToUnit } from '@polkadotcloud/utils';
import BigNumber from 'bignumber.js';
import { useApi } from 'contexts/Api';
import { useBonded } from 'contexts/Bonded';
import { useConnect } from 'contexts/Connect';
import { useFastUnstake } from 'contexts/FastUnstake';
import { useModal } from 'contexts/Modal';
import { useNetworkMetrics } from 'contexts/Network';
import { useStaking } from 'contexts/Staking';
import { useTransferOptions } from 'contexts/TransferOptions';
import { Warning } from 'library/Form/Warning';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { useUnstaking } from 'library/Hooks/useUnstaking';
import { Close } from 'library/Modal/Close';
import { SubmitTx } from 'library/SubmitTx';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NotesWrapper, PaddingWrapper, WarningsWrapper } from '../Wrappers';

export const ManageFastUnstake = () => {
  const { t } = useTranslation('modals');
  const { api, consts, network } = useApi();
  const { activeAccount } = useConnect();
  const { getControllerNotImported } = useStaking();
  const { getBondedAccount } = useBonded();
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

  const submitExtrinsic = useSubmitExtrinsic({
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
  const lastExposedAgo = !isExposed
    ? new BigNumber(0)
    : activeEra.index.minus(checked[0] || 0);

  const erasRemaining = BigNumber.max(1, bondDuration.minus(lastExposedAgo));

  return (
    <>
      <Close />
      <PaddingWrapper>
        <h2 className="title unbounded">
          {t('fastUnstake', { context: 'title' })}
        </h2>
        {warnings.length > 0 ? (
          <WarningsWrapper>
            {warnings.map((text, index) => (
              <Warning key={index} text={text} />
            ))}
          </WarningsWrapper>
        ) : null}

        {isExposed ? (
          <>
            <ActionItem
              text={t('fastUnstakeExposedAgo', {
                count: lastExposedAgo.toNumber(),
              })}
            />
            <NotesWrapper noPadding>
              <p>
                {t('fastUnstakeNote1', {
                  bondDuration: bondDuration.toString(),
                })}
              </p>
              <p>
                {t('fastUnstakeNote2', { count: erasRemaining.toNumber() })}
              </p>
            </NotesWrapper>
          </>
        ) : (
          <>
            {!isFastUnstaking ? (
              <>
                <ActionItem text={t('fastUnstake', { context: 'register' })} />
                <NotesWrapper noPadding>
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
                <ActionItem text={t('fastUnstakeRegistered')} />
                <NotesWrapper noPadding>
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
          valid={valid}
          submitText={`${
            submitExtrinsic.submitting
              ? t('submitting')
              : t('fastUnstakeSubmit', {
                  context: isFastUnstaking ? 'cancel' : 'register',
                })
          }`}
          {...submitExtrinsic}
        />
      ) : null}
    </>
  );
};
