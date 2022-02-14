import { useEffect } from 'react';
import { Wrapper, ContentWrapper } from './Wrapper';
import { useModal } from '../../contexts/Modal';
import { useAnimation } from 'framer-motion';
import { ConnectAccounts } from '../../modals/ConnectAccounts';

export const Modal = (props: any) => {

  const { status, setStatus, modal } = useModal();
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
    <Wrapper
      initial={{
        opacity: 0
      }}
      animate={controls}
      transition={{
        duration: 0.25,
      }}
      variants={variants}
    >
      <div className='content_wrapper'>
        <ContentWrapper
        >
          {modal === 'ConnectAccounts' && <ConnectAccounts />}
        </ContentWrapper>
        <button className='close' onClick={() => { onFadeOut() }}>
        </button>
      </div>
    </Wrapper>
  )

}

export default Modal;