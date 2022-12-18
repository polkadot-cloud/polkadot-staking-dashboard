// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
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
import { EstimatedTxFee } from 'library/EstimatedTxFee';
import { Warning } from 'library/Form/Warning';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { Title } from 'library/Modal/Title';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnyJson } from 'types';
import {
  FooterWrapper,
  NotesWrapper,
  PaddingWrapper,
  Separator,
  WarningsWrapper,
} from '../Wrappers';

export const ManageFastUnstake = () => {
  const { t } = useTranslation('modals');
  const { api, consts } = useApi();
  const { activeAccount } = useConnect();
  const { getControllerNotImported } = useStaking();
  const { getBondedAccount } = useBalances();
  const { txFeesValid } = useTxFees();
  const { metrics } = useNetworkMetrics();
  const { isExposed, counterForQueue, queueStatus, meta, head } =
    useFastUnstake();
  const { setResize } = useModal();
  const { getTransferOptions } = useTransferOptions();
  const { bondDuration } = consts;
  const { activeEra, fastUnstakeErasToCheckPerBlock } = metrics;
  const { checked } = meta;
  const controller = getBondedAccount(activeAccount);
  const allTransferOptions = getTransferOptions(activeAccount);
  const { nominate } = allTransferOptions;
  const { totalUnlockChuncks } = nominate;

  // TODO: also check if user is in `queueStatus`.
  const registered =
    head?.stashes.find((s: AnyJson) => s[0] === activeAccount) ?? null;

  // valid to submit transaction
  const [valid, setValid] = useState<boolean>(false);

  useEffect(() => {
    setValid(
      fastUnstakeErasToCheckPerBlock > 0 &&
        isExposed === false &&
        totalUnlockChuncks === 0
    );
  }, [isExposed, fastUnstakeErasToCheckPerBlock, totalUnlockChuncks]);

  useEffect(() => {
    setResize();
  }, [isExposed, queueStatus, registered]);

  // tx to submit
  const getTx = () => {
    let tx = null;
    if (!valid || !api) {
      return tx;
    }
    if (!registered) {
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
    callbackInBlock: () => {},
  });

  // warnings
  const warnings = [];
  if (getControllerNotImported(controller)) {
    warnings.push(t('mustHaveController'));
  }
  if (totalUnlockChuncks > 0 && !registered) {
    warnings.push(
      `You have ${totalUnlockChuncks} unlock${
        totalUnlockChuncks === 1 ? '' : 's'
      } active. No unlocks can be active to register for fast unstake. Rebond or withdraw your unlocks to become fully bonded and try registering for fast unstake again.`
    );
  }

  // manage last exposed
  let lastExposed = '';
  let lastExposedEra = 0;
  if (isExposed) {
    lastExposedEra = activeEra.index - (checked[0] || 0);
    lastExposed = `${lastExposedEra} Era${lastExposedEra !== 1 ? `s` : ``} Ago`;
  }
  const erasRemaining = Math.max(1, bondDuration - lastExposedEra);

  return (
    <>
      <Title title="Fast Unstake" icon={faBolt} />
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
            <h2 className="title">You Were Last Exposed {lastExposed}</h2>
            <Separator />
            <NotesWrapper>
              <p>
                To register for fast unstake, you must <b>not</b> be actively
                staking for more than {bondDuration} eras.
              </p>
              <p>
                If you are inactive for at least {erasRemaining} more era
                {erasRemaining === 1 ? '' : 's'}, you will be able to register
                for fast unstake.
              </p>
            </NotesWrapper>
          </>
        ) : (
          <>
            {!registered ? (
              <>
                <h2 className="title">Register For Fast Unstake</h2>
                <Separator />
                <NotesWrapper>
                  <p>
                    Once registerd you will be waiting in the fast unstake
                    queue.
                  </p>
                  <p>
                    There are currently {counterForQueue} account
                    {counterForQueue !== 1 ? 's' : ''} in the queue.
                  </p>
                  <EstimatedTxFee />
                </NotesWrapper>
              </>
            ) : (
              <>
                <h2 className="title">Registered and Waiting to Unstake</h2>
                <Separator />
                <NotesWrapper>
                  <p>
                    {counterForQueue} account
                    {counterForQueue !== 1 ? 's' : ''} in the queue.
                  </p>
                  <p>
                    The fast unstake queue is unordered, so the exact timing of
                    being selected is not known.
                  </p>
                  <EstimatedTxFee />
                </NotesWrapper>
              </>
            )}
          </>
        )}
        {!isExposed && (
          <FooterWrapper>
            <div>
              <ButtonSubmit
                text={`${
                  submitting
                    ? t('submitting')
                    : registered
                    ? 'Cancel Fast Unstake'
                    : 'Register'
                }`}
                iconLeft={faArrowAltCircleUp}
                iconTransform="grow-2"
                onClick={() => submitTx()}
                disabled={!valid || submitting || !txFeesValid}
              />
            </div>
          </FooterWrapper>
        )}
      </PaddingWrapper>
    </>
  );
};
