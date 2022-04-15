// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { motion } from "framer-motion";
import styled from 'styled-components';
import { SIDE_MENU_STICKY_THRESHOLD } from '../../constants';
import { textPrimary, textSecondary, highlightPrimary, highlightSecondary, backgroundOverlay } from '../../theme';

export const Wrapper = styled.div`
  background: none;
  border-radius: 0.7rem;
  padding: 1rem 0.5rem;
  overflow: auto;
  flex-grow: 1;
  margin: 0.75rem 0 3.35rem 1rem;
  transition: all 0.2s;
  display: flex;
  flex-flow: column nowrap;
  backdrop-filter: blur(4px);

  @media(max-width: ${SIDE_MENU_STICKY_THRESHOLD}px) {
    background: ${backgroundOverlay};
  }

  .close-menu {
    color: ${textPrimary};
    display: none;
    @media(max-width: ${SIDE_MENU_STICKY_THRESHOLD}px) {
      display: inline;
    }
  }

  section {
    &:first-child {
      flex-grow: 1;
    }
    /* Footer */
    &:last-child {
      display: flex;
      flex-flow: row wrap;
      align-items: center;
      padding-top: 0.5rem;
      
      button {
        transition: color 0.2s;
        margin-right: 0.25rem;
        color: ${textSecondary};
        opacity: 0.75;

        path {
          fill: ${textSecondary};
        }

        &:hover {
          opacity: 1;
        }
    }
  }
}
`;

export const LogoWrapper = styled(motion.button)`
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  width: 100%;
  height: 2.1rem;
  padding: 0.4rem 0.5rem;
  margin-bottom: 1rem;
`;

export const ItemWrapper = styled(motion.div) <any>`
  border-radius: 0.5rem;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: center;
  padding: 0.9rem 0.5rem;
  margin: 0.3rem 0;
  font-size: 1.04rem;

  &.active {
    background: ${highlightPrimary};
  }
  &.inactive:hover {
    background: ${highlightSecondary};
  }
  .icon {
    margin-right: 0.8rem;
  }
  .action {
    flex: 1;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-end;
  }
`;

export const HeadingWrapper = styled.div<any>`
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: center;

  h5 {
    color: ${textSecondary};
    margin: 1.1rem 0 0.2rem 0;
    padding: 0 0.5rem;
    opacity: 0.7;
  }
`;

export default Wrapper;