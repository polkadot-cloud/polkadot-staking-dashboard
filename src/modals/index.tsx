// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useModal } from 'contexts/Modal';
import { useAnimation } from 'framer-motion';
import { ErrorFallbackModal } from 'library/ErrorBoundary';
import { useEffect, useRef } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { AccountPoolRoles } from './AccountPoolRoles';
import { Bio } from './Bio';
import { Bond } from './Bond';
import { ChangeNominations } from './ChangeNominations';
import { ChangePoolRoles } from './ChangePoolRoles';
import { ChooseLanguage } from './ChooseLanguage';
import { ClaimReward } from './ClaimReward';
import { ConnectAccounts } from './ConnectAccounts';
import { DismissTips } from './DismissTips';
import { GoToFeedback } from './GoToFeedback';
import { JoinPool } from './JoinPool';
import { LeavePool } from './LeavePool';
import { ManageFastUnstake } from './ManageFastUnstake';
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
              {modal === 'Bond' && <Bond />}
              {modal === 'ChangeNominations' && <ChangeNominations />}
              {modal === 'ChangePoolRoles' && <ChangePoolRoles />}
              {modal === 'ChooseLanguage' && <ChooseLanguage />}
              {modal === 'ClaimReward' && <ClaimReward />}
              {modal === 'ConnectAccounts' && <ConnectAccounts />}
              {modal === 'DismissTips' && <DismissTips />}
              {modal === 'GoToFeedback' && <GoToFeedback />}
              {modal === 'JoinPool' && <JoinPool />}
              {modal === 'LeavePool' && <LeavePool />}
              {modal === 'ManagePool' && <ManagePool />}
              {modal === 'ManageFastUnstake' && <ManageFastUnstake />}
              {modal === 'Networks' && <Networks />}
              {modal === 'Nominate' && <Nominate />}
              {modal === 'NominateFromFavorites' && <NominateFromFavorites />}
              {modal === 'NominatePool' && <NominatePool />}
              {modal === 'PoolNominations' && <PoolNominations />}
              {modal === 'SelectFavorites' && <SelectFavorites />}
              {modal === 'Settings' && <Settings />}
              {modal === 'ValidatorMetrics' && <ValidatorMetrics />}
              {modal === 'UnbondPoolMember' && <UnbondPoolMember />}
              {modal === 'UnlockChunks' && <UnlockChunks />}
              {modal === 'UpdateController' && <UpdateController />}
              {modal === 'UpdateBond' && <UpdateBond />}
              {modal === 'UpdatePayee' && <UpdatePayee />}
              {modal === 'WithdrawPoolMember' && <WithdrawPoolMember />}
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
