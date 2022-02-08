import { useEffect } from 'react';
import { useAssistant } from '../../contexts/Assistant';
import { Wrapper, ContentWrapper, ListWrapper } from './Wrapper';
import Item from './Item';
import { pageTitleFromUri } from '../../pages';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowCircleRight as faArrow } from '@fortawesome/free-solid-svg-icons'

export const Assistant = () => {

  const assistant = useAssistant();
  const { pathname } = useLocation();

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

  useEffect(() => {
    console.log('refetch assistant items');
  }, [pathname]);


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
          <h3>
            {pageTitleFromUri(pathname)} Resources
            <span>
              <button onClick={() => { assistant.toggle() }}>
                <FontAwesomeIcon icon={faArrow} transform="grow-12" />
              </button>
            </span>
          </h3>
          <ListWrapper>
            <Item />
            <Item />
            <Item />
            <Item />
            <Item />
          </ListWrapper>

        </ContentWrapper>
      </Wrapper >
    </>
  );
}

export default Assistant;