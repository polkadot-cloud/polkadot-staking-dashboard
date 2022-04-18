// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { motion } from "framer-motion";
import { SIDE_MENU_STICKY_THRESHOLD } from '../../constants';
import { textSecondary, textInvert, backgroundSecondary, tooltipBackground } from '../../theme';

export const Wrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  padding: 0 3rem 0 1.5rem;

  @media(max-width: ${SIDE_MENU_STICKY_THRESHOLD}px) {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
`;

export const ListWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  padding-top: 1rem;
`;

export const StatBoxWrapper = styled(motion.div)`
  display: flex;
  flex-flow: column wrap;
  z-index: 0;
  flex-basis: 100%;
  flex: 1;
  flex-basis: 100%;
  margin-bottom: 1rem;

  @media(min-width: 800px) {
    flex-basis: 33%;
    min-width: 200px;
    max-width: none;
    margin-bottom: 0;
  }

  /* responsive screen sizing */
  h2 {
    font-size: 1.2rem;
  }
  
  @media(min-width: 950px) {
    max-width: 300px;
    h2 { font-size: 1.35rem; }
  }

  .content {
    background: ${backgroundSecondary};
    display: flex;
    border-radius: 0.75rem;
    margin-right: 1.25rem;
    padding: 1.1rem 0;
    height: 100%;
    max-height: 90px;
    flex-flow: row wrap;

    @media(max-width: 749px) {
      margin-right: 0;
      padding: 0.9rem 0;
    }
    
    h2, h4 { margin: 0; }

    > .chart {
      position: relative;
      display: flex;
      flex-flow: row nowrap;
      justify-content: center;
      align-items: center;
      padding-left: 1rem;

      .tooltip {
        background: ${tooltipBackground};
        opacity: 0;
        position: absolute;
        top: -20px;
        left: -8px;
        z-index: 2;
        border-radius: 0.5rem;
        padding: 0 0.5rem;
        width: auto;
        max-width: 200px;
        transition: opacity 0.2s;

        p {
          text-align: center;
          color: ${textInvert};
          margin: 0;
          font-size: 0.9rem;
        }
      }

      &:hover {
        .tooltip {
          opacity: 1;
        }
      }
    }

    > .labels {
      padding-left: 1.25rem;
      flex-basis: 70%;
      flex: 1;
      display: flex;
      flex-flow: column wrap;
      justify-content: center;

      h2 {
        display: flex;
        flex-flow: row wrap;
        justify-content: flex-start;
        align-items: flex-start;
        margin-bottom: 0.5rem;
        
        span.total {
          color: ${textSecondary};
          font-size: 0.9rem;
          margin-left: 0.3rem;
          margin-top: 0.2rem;
        }
      }
    }
  }
`;

export default Wrapper;