// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  ModalContainer,
  ModalCard,
  ModalHeight,
  ModalScroll,
  ModalContent,
  ModalCanvas,
  ModalOverlay,
} from '@polkadot-cloud/react';
import { useAnimation } from 'framer-motion';
import React, { useEffect, useRef } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallbackModal } from 'library/ErrorBoundary';
import { useHelp } from 'contexts/Help';
import { useOverlay } from 'contexts/Overlay';
import type {
  CanvasProps,
  CanvasStatus,
  ModalProps,
  OverlayProps,
} from 'contexts/Overlay/types';
import { CanvasWrapper } from 'library/Canvas/Wrappers';
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
      externalOverlayStatus={status}
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

export const Overlay = ({
  modals = {},
  canvas = {},
  externalOverlayStatus,
}: OverlayProps) => {
  return (
    <>
      <OverlayBackground externalOverlayStatus={externalOverlayStatus} />
      <Modal modals={modals} externalOverlayStatus={externalOverlayStatus} />
      <Canvas canvas={canvas} externalOverlayStatus={externalOverlayStatus} />
    </>
  );
};

export const Modal = ({ modals, externalOverlayStatus }: ModalProps) => {
  const {
    activeOverlayInstance,
    setOpenOverlayInstances,
    setActiveOverlayInstance,
    modal: {
      config: { key, size, options },
      status,
      modalHeight,
      modalResizeCounter,
      setModalRef,
      modalMaxHeight,
      setModalHeight,
      setModalStatus,
      setModalHeightRef,
    },
  } = useOverlay();
  const controls = useAnimation();
  const { status: canvasStatus } = useOverlay().canvas;
  const modalRef = useRef<HTMLDivElement>(null);
  const heightRef = useRef<HTMLDivElement>(null);

  const onOutClose = async () => {
    setOpenOverlayInstances('dec', 'modal');
    setActiveOverlayInstance(null);
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
    h = h > modalMaxHeight ? modalMaxHeight : h;
    setModalHeight(h);
  };

  // Control on modal status change.
  useEffect(() => {
    if (activeOverlayInstance === 'modal' && status === 'open') onIn();
    if (status === 'closing') onOutClose();
  }, [status]);

  // Control on canvas status change.
  useEffect(() => {
    // fade out modal if canvas has been opened.
    if (canvasStatus === 'open' && status === 'open') onOut();
    // fade in modal if its open & canvas is closing.
    if (canvasStatus === 'closing') {
      if (status === 'open') onIn();
    }
  }, [canvasStatus]);

  // Control dim external overlay change.
  useEffect(() => {
    // fade out modal if external overlay has been opened.
    if (externalOverlayStatus === 'open' && status === 'open') onOut();
    // fade in modal if its open & external overlay is closing.
    if (
      externalOverlayStatus === 'closing' &&
      activeOverlayInstance === 'modal'
    )
      onIn();
  }, [externalOverlayStatus]);

  // Resize modal on status or resize change.
  useEffect(() => handleResize(), [modalResizeCounter]);

  // Resize modal on window size change.
  useEffect(() => {
    windowResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  // Update the modal's content ref as they are initialised.
  useEffect(() => {
    setModalRef(modalRef);
    setModalHeightRef(heightRef);
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

  const ActiveModal: React.FC | null = modals?.[key] || null;

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
                height: modalHeight,
                overflow:
                  modalHeight >= modalMaxHeight && !options?.disableScroll
                    ? 'scroll'
                    : 'hidden',
              }}
            >
              <ModalCard
                ref={modalRef}
                className={
                  externalOverlayStatus === 'open' || canvasStatus === 'open'
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

export const Canvas = ({ canvas, externalOverlayStatus }: CanvasProps) => {
  const controls = useAnimation();
  const {
    setOpenOverlayInstances,
    activeOverlayInstance,
    setActiveOverlayInstance,
    modal: { status: modalStatus },
    canvas: {
      status,
      setCanvasStatus,
      config: { key },
    },
  } = useOverlay();

  const onIn = async () => {
    await controls.start('visible');
  };

  const onOut = async (closing: boolean) => {
    if (closing) {
      setOpenOverlayInstances('dec', 'canvas');
      setActiveOverlayInstance(modalStatus === 'open' ? 'modal' : null);
    }
    await controls.start('hidden');

    if (closing) setCanvasStatus('closed');
  };

  // Control dim help status change.
  useEffect(() => {
    if (externalOverlayStatus === 'open' && status === 'open') onOut(false);

    if (externalOverlayStatus === 'closing') {
      if (activeOverlayInstance === 'canvas') {
        setCanvasStatus('open');
        onIn();
      }
    }
  }, [externalOverlayStatus]);

  useEffect(() => {
    // canvas has been opened - fade in.
    if (status === 'open') {
      onIn();
    }
    // canvas closure triggered - fade out.
    if (status === 'closing') {
      onOut(true);
    }
  }, [status]);

  if (status === 'closed') {
    return <></>;
  }

  const ActiveCanvas: React.FC | null = canvas?.[key] || null;

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

export const OverlayBackground = ({
  externalOverlayStatus,
}: {
  externalOverlayStatus?: CanvasStatus;
}) => {
  const controls = useAnimation();
  const {
    modal: { status: modalStatus },
    canvas: { status: canvasStatus },
  } = useOverlay();

  let { openOverlayInstances } = useOverlay();
  if (externalOverlayStatus === 'open') {
    openOverlayInstances++;
  }

  const onIn = async () => {
    await controls.start('visible');
  };
  const onOut = async () => {
    await controls.start('hidden');
  };

  useEffect(() => {
    if (openOverlayInstances > 0) onIn();
    if (openOverlayInstances === 0) onOut();
  }, [openOverlayInstances]);

  if (
    modalStatus === 'closed' &&
    externalOverlayStatus === 'closed' &&
    canvasStatus === 'closed'
  ) {
    return <></>;
  }

  return (
    <ModalOverlay
      blur={
        canvasStatus === 'open' || externalOverlayStatus === 'open'
          ? '14px'
          : '4px'
      }
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
    />
  );
};
