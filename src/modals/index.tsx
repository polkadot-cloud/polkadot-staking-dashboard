// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useRef } from 'react';
import { useAnimation } from 'framer-motion';
import { useModal } from 'contexts/Modal';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallbackModal } from 'library/ErrorBoundary';
import { PoolNominations } from './PoolNominations';
import { ModalWrapper, ContentWrapper, HeightWrapper } from './Wrappers';
import { ConnectAccounts } from './ConnectAccounts';
import { ValidatorMetrics } from './ValidatorMetrics';
import { UpdateController } from './UpdateController';
import { Settings } from './Settings';
import { UpdateBond } from './UpdateBond';
import { UpdatePayee } from './UpdatePayee';
import { ChangeNominations } from './ChangeNominations';
import { Nominate } from './Nominate';
import { UnlockChunks } from './UnlockChunks';
import { NominatePool } from './NominatePool';
import { JoinPool } from './JoinPool';
import { LeavePool } from './LeavePool';
import { ChangePoolRoles } from './ChangePoolRoles';
import { ClaimReward } from './ClaimReward';
import { SelectFavourites } from './SelectFavourites';
import { NominateFromFavourites } from './NominateFromFavourites';
import { Networks } from './Networks';
import { Bio } from './Bio';
import { ManagePool } from './ManagePool';
import { GoToFeedback } from './GoToFeedback';
import { UnbondPoolMember } from './UnbondPoolMember';
import { WithdrawPoolMember } from './WithdrawPoolMember';
import { ChooseLanguage } from './ChooseLanguage';
import { AccountPoolRoles } from './AccountPoolRoles';

export const Modal = () => {
  const { setModalHeight, setStatus, status, modal, size, height, resize } =
    useModal();
  const controls = useAnimation();

  const maxHeight = window.innerHeight * 0.8;

  const onFadeIn = async () => {
    await controls.start('visible');
  };

  const onFadeOut = async () => {
    await controls.start('hidden');
    setStatus(0);
  };

  const variants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
    },
  };

  useEffect(() => {
    // modal has been opened - fade in
    if (status === 1) {
      onFadeIn();
    }
    // an external component triggered modal closure - fade out
    if (status === 2) {
      onFadeOut();
    }
  }, [status]);

  const modalRef = useRef<HTMLDivElement>(null);

  // resize modal on status or resize change
  useEffect(() => {
    handleResize();
  }, [resize]);

  const handleResize = () => {
    let _height = modalRef.current?.clientHeight ?? 0;
    _height = _height > maxHeight ? maxHeight : _height;
    setModalHeight(_height);
  };

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
              {modal === 'SelectFavourites' && <SelectFavourites />}
              {modal === 'Networks' && <Networks />}
              {modal === 'NominateFromFavourites' && <NominateFromFavourites />}
              {modal === 'PoolNominations' && <PoolNominations />}
              {modal === 'UnbondPoolMember' && <UnbondPoolMember />}
              {modal === 'WithdrawPoolMember' && <WithdrawPoolMember />}
              {modal === 'GoToFeedback' && <GoToFeedback />}
              {modal === 'ChooseLanguage' && <ChooseLanguage />}
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
