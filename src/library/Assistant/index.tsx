import { useEffect, useState } from 'react';
import { useAssistant } from '../../contexts/Assistant';
import { Wrapper, SectionsWrapper } from './Wrappers';
import { useLocation } from 'react-router-dom';
import { Sections } from './Sections';

export const Assistant = () => {

  const assistant = useAssistant();
  const { pathname } = useLocation();

  const [activeSection, setActiveSection] = useState(0);

  // container variants
  const containerVariants = {
    hidden: {
      opacity: 1,
      right: '-600px',
    },
    visible: {
      opacity: 1,
      right: '0px',
    },
  };

  // section variants
  const sectionVariants = {
    home: {
      left: 0,
    },
    item: {
      left: '-100%',
    },
  };

  useEffect(() => {
    console.log('refetch assistant items');
  }, [pathname]);

  // animate assistant container default
  const animateContainer = assistant.open ? `visible` : `hidden`;

  // animate assistant container default
  const animateSections = activeSection === 0 ? `home` : `item`;

  return (
    <>
      <Wrapper
        initial={false}
        animate={animateContainer}
        transition={{
          duration: 0.5,
          type: "spring",
          bounce: 0.22
        }}
        variants={containerVariants}
      >
        <SectionsWrapper
          animate={animateSections}
          transition={{
            duration: 0.5,
            type: "spring",
            bounce: 0.22
          }}
          variants={sectionVariants}
        >
          <Sections
            setActiveSection={setActiveSection}
          />
        </SectionsWrapper>
      </Wrapper>
    </>
  );
}

export default Assistant;