import { useEffect } from 'react';
import { Wrapper, ContentWrapper } from './Wrapper';
import { useModal } from '../../contexts/Modal';
import { motion, useAnimation } from 'framer-motion';

export const Modal = (props: any) => {

  const { open, toggle } = useModal();
  const controls = useAnimation();

  const { content } = props;

  const onFadeIn = async () => {
    await controls.start("visible");
  }

  const onFadeOut = async () => {
    await controls.start("hidden");
    toggle();
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
    if (open) {
      onFadeIn();
    }
  }, [open]);

  if (!open) {
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
          {content}
        </ContentWrapper>
        <button className='close' onClick={() => { onFadeOut() }}>
        </button>
      </div>
    </Wrapper>
  )

}

export default Modal;