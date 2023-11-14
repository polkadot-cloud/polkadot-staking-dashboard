// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  ActionItem,
  ModalNotes,
  ModalPadding,
  ModalWarnings,
} from '@polkadot-cloud/react';
import { planckToUnit } from '@polkadot-cloud/utils';
import BigNumber from 'bignumber.js';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { useBonded } from 'contexts/Bonded';
import { useFastUnstake } from 'contexts/FastUnstake';
import { useNetworkMetrics } from 'contexts/NetworkMetrics';
import { useTransferOptions } from 'contexts/TransferOptions';
import { Warning } from 'library/Form/Warning';
import { useSignerWarnings } from 'library/Hooks/useSignerWarnings';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { useUnstaking } from 'library/Hooks/useUnstaking';
import { Close } from 'library/Modal/Close';
import { SubmitTx } from 'library/SubmitTx';
import { useTxMeta } from 'contexts/TxMeta';
import { useOverlay } from '@polkadot-cloud/react/hooks';
import { useNetwork } from 'contexts/Network';
import { useActiveAccounts } from 'contexts/ActiveAccounts';

export const ManageFastUnstake = () => {
  const { t } = useTranslation('modals');
  const { api, consts } = useApi();
  const {
    networkData: { units, unit },
  } = useNetwork();
  const { activeAccount } = useActiveAccounts();
  const { notEnoughFunds } = useTxMeta();
  const { getBondedAccount } = useBonded();
  const { isFastUnstaking } = useUnstaking();
  const { setModalResize, setModalStatus } = useOverlay().modal;
  const { getSignerWarnings } = useSignerWarnings();
  const { activeEra, metrics } = useNetworkMetrics();
  const { feeReserve, getTransferOptions } = useTransferOptions();
  const { isExposed, counterForQueue, queueDeposit, meta } = useFastUnstake();

  const { bondDuration, fastUnstakeDeposit } = consts;
  const { fastUnstakeErasToCheckPerBlock } = metrics;
  const { checked } = meta;
  const controller = getBondedAccount(activeAccount);
  const allTransferOptions = getTransferOptions(activeAccount);
  const { nominate, transferrableBalance } = allTransferOptions;
  const { totalUnlockChunks } = nominate;

  const enoughForDeposit =
    transferrableBalance.isGreaterThanOrEqualTo(fastUnstakeDeposit);

  // valid to submit transaction
  const [valid, setValid] = useState<boolean>(false);

  useEffect(() => {
    setValid(
      fastUnstakeErasToCheckPerBlock > 0 &&
        ((!isFastUnstaking &&
          enoughForDeposit &&
          isExposed === false &&
          totalUnlockChunks === 0) ||
          isFastUnstaking)
    );
  }, [
    isExposed,
    fastUnstakeErasToCheckPerBlock,
    totalUnlockChunks,
    isFastUnstaking,
    fastUnstakeDeposit,
    transferrableBalance,
    feeReserve,
  ]);

  useEffect(
    () => setModalResize(),
    [notEnoughFunds, isExposed, queueDeposit, isFastUnstaking]
  );

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
      setModalStatus('closing');
    },
  });

  // warnings
  const warnings = getSignerWarnings(
    activeAccount,
    true,
    submitExtrinsic.proxySupported
  );

  if (!isFastUnstaking) {
    if (!enoughForDeposit) {
      warnings.push(
        `${t('noEnough')} ${planckToUnit(
          fastUnstakeDeposit,
          units
        ).toString()} ${unit}`
      );
    }

    if (totalUnlockChunks > 0) {
      warnings.push(
        `${t('fastUnstakeWarningUnlocksActive', {
          count: totalUnlockChunks,
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
      <ModalPadding>
        <h2 className="title unbounded">
          {t('fastUnstake', { context: 'title' })}
        </h2>
        {warnings.length > 0 ? (
          <ModalWarnings withMargin>
            {warnings.map((text, i) => (
              <Warning key={`warning_${i}`} text={text} />
            ))}
          </ModalWarnings>
        ) : null}

        {isExposed ? (
          <>
            <ActionItem
              text={t('fastUnstakeExposedAgo', {
                count: lastExposedAgo.toNumber(),
              })}
            />
            <ModalNotes>
              <p>
                {t('fastUnstakeNote1', {
                  bondDuration: bondDuration.toString(),
                })}
              </p>
              <p>
                {t('fastUnstakeNote2', { count: erasRemaining.toNumber() })}
              </p>
            </ModalNotes>
          </>
        ) : (
          <>
            {!isFastUnstaking ? (
              <>
                <ActionItem text={t('fastUnstake', { context: 'register' })} />
                <ModalNotes>
                  <p>
                    <>
                      {t('registerFastUnstake')}{' '}
                      {planckToUnit(fastUnstakeDeposit, units).toString()}{' '}
                      {unit}. {t('fastUnstakeOnceRegistered')}
                    </>
                  </p>
                  <p>
                    {t('fastUnstakeCurrentQueue')}: <b>{counterForQueue}</b>
                  </p>
                </ModalNotes>
              </>
            ) : (
              <>
                <ActionItem text={t('fastUnstakeRegistered')} />
                <ModalNotes>
                  <p>
                    {t('fastUnstakeCurrentQueue')}: <b>{counterForQueue}</b>
                  </p>
                  <p>{t('fastUnstakeUnorderedNote')}</p>
                </ModalNotes>
              </>
            )}
          </>
        )}
      </ModalPadding>
      {!isExposed ? (
        <SubmitTx
          fromController
          valid={valid}
          submitText={
            submitExtrinsic.submitting
              ? t('submitting')
              : t('fastUnstakeSubmit', {
                  context: isFastUnstaking ? 'cancel' : 'register',
                })
          }
          {...submitExtrinsic}
        />
      ) : null}
    </>
  );
};
