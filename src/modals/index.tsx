// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useModal } from 'contexts/Modal';
import { useAnimation } from 'framer-motion';
import { ErrorFallbackModal } from 'library/ErrorBoundary';
import { useEffect, useRef } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Bio } from './Bio';
import { ChooseLanguage } from './ChooseLanguage';
import { ConnectAccounts } from './ConnectAccounts';
import { DepositFund } from './Deposit';
import { GoToFeedback } from './GoToFeedback';
import { Networks } from './Networks';
import { SelectRole } from './SelectRole';
import { Settings } from './Settings';
import { WithdrawFund } from './Withdraw';
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
              {modal === 'Bio' && <Bio />}
              {modal === 'ChooseLanguage' && <ChooseLanguage />}
              {modal === 'ConnectAccounts' && <ConnectAccounts />}
              {modal === 'GoToFeedback' && <GoToFeedback />}
              {modal === 'Networks' && <Networks />}
              {modal === 'Settings' && <Settings />}
              {modal === 'SelectRole' && <SelectRole />}
              {modal === 'DepositFund' && <DepositFund />}
              {modal === 'WithdrawFund' && <WithdrawFund />}
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
