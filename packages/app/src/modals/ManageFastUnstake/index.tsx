// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FastUnstakeDeregister } from 'api/tx/fastUnstakeDeregister';
import { FastUnstakeRegister } from 'api/tx/fastUnstakeRegister';
import BigNumber from 'bignumber.js';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useApi } from 'contexts/Api';
import { useBonded } from 'contexts/Bonded';
import { useFastUnstake } from 'contexts/FastUnstake';
import { useNetwork } from 'contexts/Network';
import { useTransferOptions } from 'contexts/TransferOptions';
import { useTxMeta } from 'contexts/TxMeta';
import { useSignerWarnings } from 'hooks/useSignerWarnings';
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic';
import { useUnstaking } from 'hooks/useUnstaking';
import { useOverlay } from 'kits/Overlay/Provider';
import { ModalNotes } from 'kits/Overlay/structure/ModalNotes';
import { ModalPadding } from 'kits/Overlay/structure/ModalPadding';
import { ModalWarnings } from 'kits/Overlay/structure/ModalWarnings';
import { ActionItem } from 'library/ActionItem';
import { Warning } from 'library/Form/Warning';
import { Close } from 'library/Modal/Close';
import { SubmitTx } from 'library/SubmitTx';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { planckToUnitBn } from 'utils';

export const ManageFastUnstake = () => {
  const { t } = useTranslation('modals');
  const {
    consts: { bondDuration, fastUnstakeDeposit },
    networkMetrics: { fastUnstakeErasToCheckPerBlock },
    activeEra,
  } = useApi();
  const {
    network,
    networkData: { units, unit },
  } = useNetwork();
  const { notEnoughFunds } = useTxMeta();
  const { getBondedAccount } = useBonded();
  const { isFastUnstaking } = useUnstaking();
  const { activeAccount } = useActiveAccounts();
  const { setModalResize, setModalStatus } = useOverlay().modal;
  const { getSignerWarnings } = useSignerWarnings();
  const { feeReserve, getTransferOptions } = useTransferOptions();
  const { isExposed, counterForQueue, queueDeposit, meta } = useFastUnstake();

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

  const getTx = () => {
    let tx = null;
    if (!valid) {
      return tx;
    }
    if (!isFastUnstaking) {
      tx = new FastUnstakeRegister(network).tx();
    } else {
      tx = new FastUnstakeDeregister(network).tx();
    }
    return tx;
  };

  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: controller,
    shouldSubmit: valid,
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
        `${t('noEnough')} ${planckToUnitBn(
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
        ) : !isFastUnstaking ? (
          <>
            <ActionItem text={t('fastUnstake', { context: 'register' })} />
            <ModalNotes>
              <p>
                {t('registerFastUnstake')}{' '}
                {planckToUnitBn(fastUnstakeDeposit, units).toString()} {unit}.{' '}
                {t('fastUnstakeOnceRegistered')}
              </p>
              <p>
                {t('fastUnstakeCurrentQueue')}: <b>{counterForQueue || 0}</b>
              </p>
            </ModalNotes>
          </>
        ) : (
          <>
            <ActionItem text={t('fastUnstakeRegistered')} />
            <ModalNotes>
              <p>
                {t('fastUnstakeCurrentQueue')}: <b>{counterForQueue || 0}</b>
              </p>
              <p>{t('fastUnstakeUnorderedNote')}</p>
            </ModalNotes>
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
