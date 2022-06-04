// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAssistant } from 'contexts/Assistant';
import { ASSISTANT_CONFIG } from 'config/assistant';
import { pageFromUri } from 'Utils';
import { AssistantContextInterface, AssistantItem } from 'types/assistant';
import { Toggle } from 'types';
import {
  Wrapper,
  CardsWrapper,
  ContentWrapper,
  HeightWrapper,
} from './Wrappers';
import { Sections } from './Sections';
import { useOutsideAlerter } from '../Hooks';

export const Assistant = () => {
  const assistant = useAssistant() as AssistantContextInterface;
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

  useEffect(() => setPageOnPathname(), [setPageOnPathname]);

  // animate assistant container default
  const animateContainer =
    assistant.open === Toggle.Open ? 'visible' : 'hidden';

  // animate assistant container default
  const animateSections = assistant.activeSection === 0 ? 'home' : 'item';

  // get page meta from active page
  const pageMeta = Object.values(ASSISTANT_CONFIG).find(
    (item: AssistantItem) => item.key === assistant.page
  );

  const ref = useRef(null);

  useOutsideAlerter(
    ref,
    () => {
      assistant.closeAssistant();
    },
    ['ignore-assistant-outside-alerter']
  );

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
          <CardsWrapper
            animate={animateSections}
            transition={{
              duration: 0.5,
              type: 'spring',
              bounce: 0.1,
            }}
            variants={sectionVariants}
          >
            <Sections pageMeta={pageMeta} />
          </CardsWrapper>
        </HeightWrapper>
      </ContentWrapper>
    </Wrapper>
  );
};

export default Assistant;
