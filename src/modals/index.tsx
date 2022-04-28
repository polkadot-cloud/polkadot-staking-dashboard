// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect } from 'react';
import { ModalWrapper, ContentWrapper } from './Wrappers';
import { useModal } from '../contexts/Modal';
import { useAnimation } from 'framer-motion';
import { ConnectAccounts } from './ConnectAccounts';
import { EraPoints } from './EraPoints';
import { UpdateController } from './UpdateController';
import { Settings } from './Settings';
import { UpdateBond } from './UpdateBond';
import { UpdatePayee } from './UpdatePayee';

export const Modal = () => {

  const { status, setStatus, modal, size } = useModal();
  const controls = useAnimation();

  const onFadeIn = async () => {
    await controls.start("visible");
  }

  const onFadeOut = async () => {
    await controls.start("hidden");
    setStatus(0);
  }

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

  if (status === 0) {
    return (<></>);
  }

  return (
    <ModalWrapper
      initial={{
        opacity: 0
      }}
      animate={controls}
      transition={{
        duration: 0.15,
      }}
      variants={variants}
    >
      <div className='content_wrapper'>
        <ContentWrapper size={size}>
          {modal === 'ConnectAccounts' && <ConnectAccounts />}
          {modal === 'EraPoints' && <EraPoints />}
          {modal === 'Settings' && <Settings />}
          {modal === 'UpdateController' && <UpdateController />}
          {modal === 'UpdateBond' && <UpdateBond />}
          {modal === 'UpdatePayee' && <UpdatePayee />}
        </ContentWrapper>
        <button className='close' onClick={() => { onFadeOut() }}>
        </button>
      </div>
    </ModalWrapper>
  )

}

export default Modal;