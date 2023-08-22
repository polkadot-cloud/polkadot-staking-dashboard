// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  ModalContainer,
  ModalCard,
  ModalHeight,
  ModalScroll,
  ModalContent,
  ModalCanvas,
} from '@polkadot-cloud/react';
import { useAnimation } from 'framer-motion';
import React, { useEffect, useRef } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallbackModal } from 'library/ErrorBoundary';
import { useHelp } from 'contexts/Help';
import { useOverlay } from 'contexts/Overlay';
import type {
  CanvasProps,
  ModalProps,
  OverlayProps,
} from 'contexts/Overlay/types';
import { CanvasWrapper } from 'library/Canvas/Wrappers';
import { TestCanvas } from 'canvas/TestCanvas';
import { AccountPoolRoles } from '../modals/AccountPoolRoles';
import { Accounts } from '../modals/Accounts';
import { Bio } from '../modals/Bio';
import { Bond } from '../modals/Bond';
import { ChangeNominations } from '../modals/ChangeNominations';
import { ChangePoolRoles } from '../modals/ChangePoolRoles';
import { ChooseLanguage } from '../modals/ChooseLanguage';
import { ClaimReward } from '../modals/ClaimReward';
import { Connect } from '../modals/Connect';
import { GoToFeedback } from '../modals/GoToFeedback';
import { ImportLedger } from '../modals/ImportLedger';
import { ImportVault } from '../modals/ImportVault';
import { JoinPool } from '../modals/JoinPool';
import { ManageFastUnstake } from '../modals/ManageFastUnstake';
import { ManagePool } from '../modals/ManagePool';
import { Networks } from '../modals/Networks';
import { Nominate } from '../modals/Nominate';
import { NominateFromFavorites } from '../modals/NominateFromFavorites';
import { NominatePool } from '../modals/NominatePool';
import { PoolNominations } from '../modals/PoolNominations';
import { SelectFavorites } from '../modals/SelectFavorites';
import { Settings } from '../modals/Settings';
import { Unbond } from '../modals/Unbond';
import { UnbondPoolMember } from '../modals/UnbondPoolMember';
import { UnlockChunks } from '../modals/UnlockChunks';
import { Unstake } from '../modals/Unstake';
import { UpdateController } from '../modals/UpdateController';
import { UpdatePayee } from '../modals/UpdatePayee';
import { UpdateReserve } from '../modals/UpdateReserve';
import { ValidatorMetrics } from '../modals/ValidatorMetrics';
import { WithdrawPoolMember } from '../modals/WithdrawPoolMember';

export const Overlays = () => {
  const { status } = useHelp();
  return (
    <Overlay
      helpStatus={status}
      canvas={{
        TestCanvas,
      }}
      modals={{
        Bio,
        AccountPoolRoles,
        Bond,
        ChangeNominations,
        ChangePoolRoles,
        ChooseLanguage,
        ClaimReward,
        Connect,
        Accounts,
        GoToFeedback,
        JoinPool,
        ImportLedger,
        ImportVault,
        ManagePool,
        ManageFastUnstake,
        Networks,
        Nominate,
        NominateFromFavorites,
        NominatePool,
        PoolNominations,
        SelectFavorites,
        Settings,
        ValidatorMetrics,
        UnbondPoolMember,
        UnlockChunks,
        Unstake,
        UpdateController,
        Unbond,
        UpdatePayee,
        UpdateReserve,
        WithdrawPoolMember,
      }}
    />
  );
};

export const Overlay = ({ modals, canvas, helpStatus }: OverlayProps) => {
  return (
    <>
      <Modal modals={modals} helpStatus={helpStatus} />
      <Canvas canvas={canvas} />
    </>
  );
};

export const Modal = ({ modals, helpStatus }: ModalProps) => {
  const {
    config: { key, size, options },
    status,
    height,
    resize,
    setModalStatus,
    setRef,
    setHeightRef,
    maxHeight,
    setHeight,
  } = useOverlay().modal;
  const controls = useAnimation();
  const { status: canvasStatus } = useOverlay().canvas;
  const modalRef = useRef<HTMLDivElement>(null);
  const heightRef = useRef<HTMLDivElement>(null);

  const onOutClose = async () => {
    await controls.start('out');
    setModalStatus('closed');
  };
  const onIn = async () => {
    await controls.start('in');
  };
  const onOut = async () => {
    await controls.start('out');
  };

  const windowResize = () => {
    if (!options?.disableWindowResize) {
      window.addEventListener('resize', handleResize);
    }
  };

  const handleResize = () => {
    if (status !== 'open' || options?.disableWindowResize) return;
    let h = modalRef.current?.clientHeight ?? 0;
    h = h > maxHeight ? maxHeight : h;
    setHeight(h);
  };

  // Control on modal status change.
  useEffect(() => {
    if (status === 'open') onIn();
    if (status === 'closing') onOutClose();
  }, [status]);

  // Control on canvas status change.
  useEffect(() => {
    if (canvasStatus === 'open') if (status === 'open') onOut();
    if (canvasStatus === 'closing') if (status === 'open') onIn();
  }, [canvasStatus]);

  // Control dim help status change.
  useEffect(() => {
    if (helpStatus === 1) if (status === 'open') onOut();
    if (helpStatus === 2) if (status === 'open') onIn();
  }, [helpStatus]);

  // resize modal on status or resize change.
  useEffect(() => handleResize(), [resize]);

  // resize modal on window size change.
  useEffect(() => {
    windowResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  // update the modal's content ref.
  useEffect(() => {
    setRef(modalRef);
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

  const ActiveModal: React.FC = modals[key] || null;

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
                  height >= maxHeight && !options?.disableScroll
                    ? 'scroll'
                    : 'hidden',
              }}
            >
              <ModalCard
                ref={modalRef}
                className={
                  helpStatus === 1 || canvasStatus === 'open'
                    ? 'dimmed'
                    : undefined
                }
              >
                <ErrorBoundary FallbackComponent={ErrorFallbackModal}>
                  {ActiveModal && <ActiveModal />}
                </ErrorBoundary>
              </ModalCard>
            </ModalHeight>
            <button
              type="button"
              className="close"
              onClick={() => {
                setModalStatus('closing');
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

export const Canvas = ({ canvas }: CanvasProps) => {
  const controls = useAnimation();
  const {
    status,
    setCanvasStatus,
    config: { key },
  } = useOverlay().canvas;

  const onFadeIn = async () => {
    await controls.start('visible');
  };

  const onFadeOut = async () => {
    await controls.start('hidden');
    setCanvasStatus('closed');
  };

  useEffect(() => {
    // canvas has been opened - fade in.
    if (status === 'open') {
      onFadeIn();
    }
    // canvas closure triggered - fade out.
    if (status === 'closing') {
      onFadeOut();
    }
  }, [status]);

  if (status === 'closed') {
    return <></>;
  }

  const ActiveCanvas: React.FC = canvas[key] || null;

  return (
    <ModalCanvas
      initial={{
        opacity: 0,
      }}
      animate={controls}
      transition={{
        duration: 0.15,
      }}
      variants={{
        hidden: {
          opacity: 0,
        },
        visible: {
          opacity: 1,
        },
      }}
    >
      <ModalScroll>
        <ModalContent>
          <CanvasWrapper>{ActiveCanvas && <ActiveCanvas />}</CanvasWrapper>
        </ModalContent>
      </ModalScroll>
    </ModalCanvas>
  );
};
