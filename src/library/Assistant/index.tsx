import { useAssistant } from '../../contexts/Assistant';
import { Wrapper, ContentWrapper, ListWrapper } from './Wrapper';
import Item from './Item';

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
  };

  const animate = assistant.open ? `visible` : `hidden`;

  return (
    <>
      <Wrapper
        initial={false}
        animate={animate}
        transition={{
          duration: 0.5,
          type: "spring",
          bounce: 0.22
        }}
        variants={variants}
      >
        <ContentWrapper>
          <h2 onClick={() => { assistant.toggle() }}>[Subject]</h2>
          <ListWrapper>
            <Item />
            <Item />
            <Item />
            <Item />
            <Item />
          </ListWrapper>

        </ContentWrapper>
      </Wrapper>
    </>
  );
}

export default Assistant;