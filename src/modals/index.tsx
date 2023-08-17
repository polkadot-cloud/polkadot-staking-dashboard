// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ModalContainer, ModalCard, ModalHeight } from '@polkadot-cloud/react';
import { useAnimation } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallbackModal } from 'library/ErrorBoundary';
import { useModal } from 'contexts/Modal';
import { useHelp } from 'contexts/Help';
import { useCanvas } from 'contexts/Canvas';
import { AccountPoolRoles } from './AccountPoolRoles';
import { Accounts } from './Accounts';
import { Bio } from './Bio';
import { Bond } from './Bond';
import { ChangeNominations } from './ChangeNominations';
import { ChangePoolRoles } from './ChangePoolRoles';
import { ChooseLanguage } from './ChooseLanguage';
import { ClaimReward } from './ClaimReward';
import { Connect } from './Connect';
import { GoToFeedback } from './GoToFeedback';
import { ImportLedger } from './ImportLedger';
import { ImportVault } from './ImportVault';
import { JoinPool } from './JoinPool';
import { ManageFastUnstake } from './ManageFastUnstake';
import { ManagePool } from './ManagePool';
import { Networks } from './Networks';
import { Nominate } from './Nominate';
import { NominateFromFavorites } from './NominateFromFavorites';
import { NominatePool } from './NominatePool';
import { PoolNominations } from './PoolNominations';
import { SelectFavorites } from './SelectFavorites';
import { Settings } from './Settings';
import { Unbond } from './Unbond';
import { UnbondPoolMember } from './UnbondPoolMember';
import { UnlockChunks } from './UnlockChunks';
import { Unstake } from './Unstake';
import { UpdateController } from './UpdateController';
import { UpdatePayee } from './UpdatePayee';
import { UpdateReserve } from './UpdateReserve';
import { ValidatorMetrics } from './ValidatorMetrics';
import { WithdrawPoolMember } from './WithdrawPoolMember';

export const Modal = () => {
  const {
    size,
    modal,
    status,
    height,
    resize,
    config,
    setStatus,
    setModalRef,
    setHeightRef,
    modalMaxHeight,
    setModalHeight,
  } = useModal();
  const controls = useAnimation();
  const maxHeight = modalMaxHeight();
  const { status: helpStatus } = useHelp();
  const { status: canvasStatus } = useCanvas();
  const modalRef = useRef<HTMLDivElement>(null);
  const heightRef = useRef<HTMLDivElement>(null);

  const onOutClose = async () => {
    await controls.start('out');
    setStatus('closed');
  };
  const onIn = async () => {
    await controls.start('in');
  };
  const onOut = async () => {
    await controls.start('out');
  };

  const windowResize = () => {
    if (!config?.disableWindowResize) {
      window.addEventListener('resize', handleResize);
    }
  };

  const handleResize = () => {
    if (status !== 'open' || config?.disableWindowResize) return;

    let h = modalRef.current?.clientHeight ?? 0;
    h = h > maxHeight ? maxHeight : h;
    setModalHeight(h);
  };

  // Control on modal status change.
  useEffect(() => {
    if (status === 'open') onIn();
    if (status === 'closing') onOutClose();
  }, [status]);

  // Control on canvas status change.
  useEffect(() => {
    if (canvasStatus === 1) if (status === 'open') onOut();
    if (canvasStatus === 2) if (status === 'open') onIn();
  }, [canvasStatus]);

  // Control dim help status change.
  useEffect(() => {
    if (helpStatus === 1) if (status === 'open') onOut();
    if (helpStatus === 2) if (status === 'open') onIn();
  }, [helpStatus]);

  // resize modal on status or resize change
  useEffect(() => {
    handleResize();
  }, [resize]);

  useEffect(() => {
    windowResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  // store the modal's content ref.
  useEffect(() => {
    setModalRef(modalRef);
    setHeightRef(heightRef);
  }, [modalRef?.current, heightRef?.current]);

  if (status === 'closed') {
    return <></>;
  }

  const variants = {
    in: {
      opacity: 1,
      scale: 1,
    },
    out: {
      opacity: 0,
      scale: 0.9,
    },
  };
  const transition = {
    duration: 0.2,
  };
  const initial = {
    opacity: 0,
    scale: 0.9,
  };

  return (
    <>
      {status !== 'replacing' ? (
        <ModalContainer
          initial={initial}
          animate={controls}
          transition={transition}
          variants={variants}
          style={{ opacity: status === 'opening' ? 0 : 1 }}
        >
          <div>
            <ModalHeight
              ref={heightRef}
              size={size}
              style={{
                height,
                overflow:
                  height >= maxHeight && !config?.disableScroll
                    ? 'scroll'
                    : 'hidden',
              }}
            >
              <ModalCard
                ref={modalRef}
                className={
                  helpStatus === 1 || canvasStatus === 1 ? 'dimmed' : undefined
                }
              >
                <ErrorBoundary FallbackComponent={ErrorFallbackModal}>
                  {modal === 'AccountPoolRoles' && <AccountPoolRoles />}
                  {modal === 'Bio' && <Bio />}
                  {modal === 'Bond' && <Bond />}
                  {modal === 'ChangeNominations' && <ChangeNominations />}
                  {modal === 'ChangePoolRoles' && <ChangePoolRoles />}
                  {modal === 'ChooseLanguage' && <ChooseLanguage />}
                  {modal === 'ClaimReward' && <ClaimReward />}
                  {modal === 'Connect' && <Connect />}
                  {modal === 'Accounts' && <Accounts />}
                  {modal === 'GoToFeedback' && <GoToFeedback />}
                  {modal === 'JoinPool' && <JoinPool />}
                  {modal === 'ImportLedger' && <ImportLedger />}
                  {modal === 'ImportVault' && <ImportVault />}
                  {modal === 'ManagePool' && <ManagePool />}
                  {modal === 'ManageFastUnstake' && <ManageFastUnstake />}
                  {modal === 'Networks' && <Networks />}
                  {modal === 'Nominate' && <Nominate />}
                  {modal === 'NominateFromFavorites' && (
                    <NominateFromFavorites />
                  )}
                  {modal === 'NominatePool' && <NominatePool />}
                  {modal === 'PoolNominations' && <PoolNominations />}
                  {modal === 'SelectFavorites' && <SelectFavorites />}
                  {modal === 'Settings' && <Settings />}
                  {modal === 'ValidatorMetrics' && <ValidatorMetrics />}
                  {modal === 'UnbondPoolMember' && <UnbondPoolMember />}
                  {modal === 'UnlockChunks' && <UnlockChunks />}
                  {modal === 'Unstake' && <Unstake />}
                  {modal === 'UpdateController' && <UpdateController />}
                  {modal === 'Unbond' && <Unbond />}
                  {modal === 'UpdatePayee' && <UpdatePayee />}
                  {modal === 'UpdateReserve' && <UpdateReserve />}
                  {modal === 'WithdrawPoolMember' && <WithdrawPoolMember />}
                </ErrorBoundary>
              </ModalCard>
            </ModalHeight>
            <button
              type="button"
              className="close"
              onClick={() => {
                setStatus('closing');
              }}
            >
              &nbsp;
            </button>
          </div>
        </ModalContainer>
      ) : null}
    </>
  );
};
