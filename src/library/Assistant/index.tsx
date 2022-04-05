// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect } from 'react';
import { useAssistant } from '../../contexts/Assistant';
import { Wrapper, SectionsWrapper } from './Wrappers';
import { useLocation } from 'react-router-dom';
import { Sections } from './Sections';
import { ASSISTANT_CONFIG } from '../../pages';
import { pageFromUri } from '../../Utils';

export const Assistant = () => {

  const assistant = useAssistant();
  const { pathname } = useLocation();

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
    assistant.setPage(pageFromUri(pathname));
  }, [pathname]);

  // animate assistant container default
  const animateContainer = assistant.open ? `visible` : `hidden`;

  // animate assistant container default
  const animateSections = assistant.activeSection === 0 ? `home` : `item`;

  // get page meta from active page
  const pageMeta = Object.values(ASSISTANT_CONFIG).find((item: any) =>
    item.key === assistant.page
  );

  return (
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
          pageMeta={pageMeta}
        />
      </SectionsWrapper>
    </Wrapper>
  );
}

export default Assistant;