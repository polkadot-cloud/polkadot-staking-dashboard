// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useModal } from 'contexts/Modal';
import { useAnimation } from 'framer-motion';
import { ErrorFallbackModal } from 'library/ErrorBoundary';
import { useCallback, useEffect, useRef } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { AccountPoolRoles } from './AccountPoolRoles';
import { Bio } from './Bio';
import { ChangeNominations } from './ChangeNominations';
import { ChangePoolRoles } from './ChangePoolRoles';
import { ClaimReward } from './ClaimReward';
import { ConnectAccounts } from './ConnectAccounts';
import { GoToFeedback } from './GoToFeedback';
import { JoinPool } from './JoinPool';
import { LeavePool } from './LeavePool';
import { ManagePool } from './ManagePool';
import { Networks } from './Networks';
import { Nominate } from './Nominate';
import { NominateFromFavorites } from './NominateFromFavorites';
import { NominatePool } from './NominatePool';
import { PoolNominations } from './PoolNominations';
import { SelectFavorites } from './SelectFavorites';
import { Settings } from './Settings';
import { UnbondPoolMember } from './UnbondPoolMember';
import { UnlockChunks } from './UnlockChunks';
import { UpdateBond } from './UpdateBond';
import { UpdateController } from './UpdateController';
import { UpdatePayee } from './UpdatePayee';
import { ValidatorMetrics } from './ValidatorMetrics';
import { WithdrawPoolMember } from './WithdrawPoolMember';
import { ContentWrapper, HeightWrapper, ModalWrapper } from './Wrappers';

export const Modal = () => {
  const { setModalHeight, setStatus, status, modal, size, height, resize } =
    useModal();
  const controls = useAnimation();

  const maxHeight = window.innerHeight * 0.8;

  const variants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
    },
  };

  const onFadeIn = useCallback(async () => {
    await controls.start('visible');
  }, [controls]);

  const onFadeOut = useCallback(async () => {
    await controls.start('hidden');
    setStatus(0);
  }, [controls, setStatus]);

  useEffect(() => {
    // modal has been opened - fade in
    if (status === 1) {
      onFadeIn();
    }
    // an external component triggered modal closure - fade out
    if (status === 2) {
      onFadeOut();
    }
  }, [controls, onFadeIn, onFadeOut, setStatus, status]);

  const modalRef = useRef<HTMLDivElement>(null);

  // resize modal on status or resize change
  useEffect(() => {
    let _height = modalRef.current?.clientHeight ?? 0;
    _height = _height > maxHeight ? maxHeight : _height;
    setModalHeight(_height);
  }, [maxHeight, resize, setModalHeight]);

  if (status === 0) {
    return <></>;
  }

  return (
    <ModalWrapper
      initial={{
        opacity: 0,
      }}
      animate={controls}
      transition={{
        duration: 0.15,
      }}
      variants={variants}
    >
      <div>
        <HeightWrapper
          size={size}
          style={{
            height,
            overflow: height >= maxHeight ? 'scroll' : 'hidden',
          }}
        >
          <ContentWrapper ref={modalRef}>
            <ErrorBoundary FallbackComponent={ErrorFallbackModal}>
              {modal === 'AccountPoolRoles' && <AccountPoolRoles />}
              {modal === 'Bio' && <Bio />}
              {modal === 'ChangeNominations' && <ChangeNominations />}
              {modal === 'ChangePoolRoles' && <ChangePoolRoles />}
              {modal === 'ClaimReward' && <ClaimReward />}
              {modal === 'ConnectAccounts' && <ConnectAccounts />}
              {modal === 'JoinPool' && <JoinPool />}
              {modal === 'Settings' && <Settings />}
              {modal === 'UpdateController' && <UpdateController />}
              {modal === 'UpdateBond' && <UpdateBond />}
              {modal === 'UpdatePayee' && <UpdatePayee />}
              {modal === 'ValidatorMetrics' && <ValidatorMetrics />}
              {modal === 'ManagePool' && <ManagePool />}
              {modal === 'Nominate' && <Nominate />}
              {modal === 'UnlockChunks' && <UnlockChunks />}
              {modal === 'NominatePool' && <NominatePool />}
              {modal === 'LeavePool' && <LeavePool />}
              {modal === 'SelectFavorites' && <SelectFavorites />}
              {modal === 'Networks' && <Networks />}
              {modal === 'NominateFromFavorites' && <NominateFromFavorites />}
              {modal === 'PoolNominations' && <PoolNominations />}
              {modal === 'UnbondPoolMember' && <UnbondPoolMember />}
              {modal === 'WithdrawPoolMember' && <WithdrawPoolMember />}
              {modal === 'GoToFeedback' && <GoToFeedback />}
            </ErrorBoundary>
          </ContentWrapper>
        </HeightWrapper>
        <button
          type="button"
          className="close"
          onClick={() => {
            onFadeOut();
          }}
        >
          &nbsp;
        </button>
      </div>
    </ModalWrapper>
  );
};

export default Modal;
