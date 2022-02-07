import { useAssistant } from '../../contexts/Assistant';
import { Wrapper, ContentWrapper } from './Wrapper';
import { MAX_ASSISTANT_INTERFACE_WIDTH } from '../../constants';

export const Assistant = () => {

  const assistant = useAssistant();

  const variants = {
    hidden: {
      opacity: 1,
      right: '-600px',
    },
    visible: {
      opacity: 1,
      right: '0px',
    },
  }

  const initial = assistant.open ? `hidden` : `visible`;
  const animate = assistant.open ? `visible` : `hidden`;

  return (
    <>
      <Wrapper
        initial={initial}
        animate={animate}
        transition={{
          duration: 0.5,
        }}
        variants={variants}
        style={{
          display: 'flex',
          position: 'absolute',
          top: 0,
          width: '100%',
          maxWidth: `${MAX_ASSISTANT_INTERFACE_WIDTH}px`,
          height: '100%',
          flexFlow: 'column nowrap',
          zIndex: 2,
        }}
      >
        <ContentWrapper>
          <h2 onClick={() => { assistant.toggle() }}>Assistant</h2>
        </ContentWrapper>
      </Wrapper>
    </>
  );
}

export default Assistant;