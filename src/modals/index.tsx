// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useModal } from 'contexts/Modal';
import { useAnimation } from 'framer-motion';
import { ErrorFallbackModal } from 'library/ErrorBoundary';
import { useEffect, useRef } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
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
import { JoinPool } from './JoinPool';
import { LeavePool } from './LeavePool';
import { LedgerImport } from './LedgerImport';
import { ManageFastUnstake } from './ManageFastUnstake';
import { ManagePool } from './ManagePool';
import { Networks } from './Networks';
import { Nominate } from './Nominate';
import { NominateFromFavorites } from './NominateFromFavorites';
import { NominatePool } from './NominatePool';
import { PoolNominations } from './PoolNominations';
import { SelectFavorites } from './SelectFavorites';
import { Settings } from './Settings';
import { StartStaking } from './StartStaking';
import { Unbond } from './Unbond';
import { UnbondPoolMember } from './UnbondPoolMember';
import { UnlockChunks } from './UnlockChunks';
import { Unstake } from './Unstake';
import { UpdateController } from './UpdateController';
import { UpdatePayee } from './UpdatePayee';
import { ValidatorMetrics } from './ValidatorMetrics';
import { WithdrawPoolMember } from './WithdrawPoolMember';
import {
  ContentWrapper,
  HeightWrapper,
  ModalBlurWrapper,
  ModalWrapper,
} from './Wrappers';

export const Modal = () => {
  const {
    setModalHeight,
    setStatus,
    status,
    modal,
    size,
    height,
    resize,
    config,
    modalMaxHeight,
  } = useModal();
  const controls = useAnimation();

  const maxHeight = modalMaxHeight();

  const onFadeIn = async () => {
    await controls.start('visible');
  };

  const onFadeOut = async () => {
    await controls.start('hidden');
    setStatus(0);
  };

  useEffect(() => {
    windowResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  const windowResize = () => {
    if (!config?.disableWindowResize) {
      window.addEventListener('resize', handleResize);
    }
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
    if (status !== 1 || config?.disableWindowResize) return;

    let h = modalRef.current?.clientHeight ?? 0;
    h = h > maxHeight ? maxHeight : h;
    setModalHeight(h);
  };

  if (status === 0) {
    return <></>;
  }

  const variants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
    },
  };
  const transition = {
    duration: 0.15,
  };
  const initial = {
    opacity: 0,
  };

  return (
    <>
      <ModalBlurWrapper
        initial={initial}
        animate={controls}
        transition={transition}
        variants={variants}
      />
      {status !== 3 ? (
        <ModalWrapper
          initial={initial}
          animate={controls}
          transition={transition}
          variants={variants}
        >
          <div>
            <HeightWrapper
              size={size}
              style={{
                height,
                overflow:
                  height >= maxHeight && !config?.disableScroll
                    ? 'scroll'
                    : 'hidden',
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
                  {modal === 'Connect' && <Connect />}
                  {modal === 'Accounts' && <Accounts />}
                  {modal === 'GoToFeedback' && <GoToFeedback />}
                  {modal === 'JoinPool' && <JoinPool />}
                  {modal === 'LedgerImport' && <LedgerImport />}
                  {modal === 'LeavePool' && <LeavePool />}
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
                  {modal === 'StartStaking' && <StartStaking />}
                  {modal === 'ValidatorMetrics' && <ValidatorMetrics />}
                  {modal === 'UnbondPoolMember' && <UnbondPoolMember />}
                  {modal === 'UnlockChunks' && <UnlockChunks />}
                  {modal === 'Unstake' && <Unstake />}
                  {modal === 'UpdateController' && <UpdateController />}
                  {modal === 'Unbond' && <Unbond />}
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
      ) : null}
    </>
  );
};
