// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useRef } from 'react';
import { useAnimation } from 'framer-motion';
import { useModal } from 'contexts/Modal';
import { ModalWrapper, ContentWrapper, HeightWrapper } from './Wrappers';
import { ConnectAccounts } from './ConnectAccounts';
import { ValidatorMetrics } from './ValidatorMetrics';
import { UpdateController } from './UpdateController';
import { Settings } from './Settings';
import { UpdateBond } from './UpdateBond';
import { UpdatePayee } from './UpdatePayee';
import { StopNominating } from './StopNominating';
import { Nominate } from './Nominate';
import { UnlockChunks } from './UnlockChunks';
import { CreatePool } from './CreatePool';
import { NominatePool } from './NominatePool';
import { JoinPool } from './JoinPool';
import { ClaimReward } from './ClaimReward';
import { SelectFavourites } from './SelectFavourites';

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

  const modalRef: any = useRef(null);

  // resize modal on status or resize change
  useEffect(() => {
    let _height = modalRef.current?.clientHeight;
    _height = _height > maxHeight ? maxHeight : _height;

    setModalHeight(_height);
  }, [status, resize]);

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
      <div className="content_wrapper">
        <HeightWrapper
          size={size}
          style={{
            height,
            overflow: height >= maxHeight ? 'scroll' : 'hidden',
          }}
        >
          <ContentWrapper ref={modalRef}>
            {modal === 'ConnectAccounts' && <ConnectAccounts />}
            {modal === 'ValidatorMetrics' && <ValidatorMetrics />}
            {modal === 'Settings' && <Settings />}
            {modal === 'UpdateController' && <UpdateController />}
            {modal === 'UpdateBond' && <UpdateBond />}
            {modal === 'UpdatePayee' && <UpdatePayee />}
            {modal === 'StopNominating' && <StopNominating />}
            {modal === 'Nominate' && <Nominate />}
            {modal === 'UnlockChunks' && <UnlockChunks />}
            {modal === 'CreatePool' && <CreatePool />}
            {modal === 'NominatePool' && <NominatePool />}
            {modal === 'JoinPool' && <JoinPool />}
            {modal === 'ClaimReward' && <ClaimReward />}
            {modal === 'SelectFavourites' && <SelectFavourites />}
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
