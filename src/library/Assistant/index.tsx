// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAssistant } from '../../contexts/Assistant';
import {
  Wrapper, SectionsWrapper, ContentWrapper, HeightWrapper,
} from './Wrappers';
import { Sections } from './Sections';
import { ASSISTANT_CONFIG } from '../../pages';
import { pageFromUri } from '../../Utils';
import { useOutsideAlerter } from '../Hooks';

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

  const setPageOnPathname = useCallback(() => {
    assistant.setPage(pageFromUri(pathname));
  }, [pathname]);

  useEffect(
    () => setPageOnPathname(),
    [setPageOnPathname],
  );

  // animate assistant container default
  const animateContainer = assistant.open ? 'visible' : 'hidden';

  // animate assistant container default
  const animateSections = assistant.activeSection === 0 ? 'home' : 'item';

  // get page meta from active page
  const pageMeta = Object.values(ASSISTANT_CONFIG).find((item: any) => item.key === assistant.page);

  const ref = useRef(null);

  useOutsideAlerter(ref, () => {
    assistant.closeAssistant(pageFromUri(pathname));
  }, ['ignore-assistant-outside-alerter']);

  return (
    <Wrapper
      ref={ref}
      initial={false}
      animate={animateContainer}
      transition={{
        duration: 0.5,
        type: 'spring',
        bounce: 0.2,
      }}
      variants={containerVariants}
    >
      <ContentWrapper>
        <HeightWrapper
          style={{ height: assistant.height }}
          transition={assistant.transition}
        >
          <SectionsWrapper
            animate={animateSections}
            transition={{
              duration: 0.5,
              type: 'spring',
              bounce: 0.1,
            }}
            variants={sectionVariants}
          >
            <Sections pageMeta={pageMeta} />
          </SectionsWrapper>
        </HeightWrapper>
      </ContentWrapper>
    </Wrapper>
  );
};

export default Assistant;
