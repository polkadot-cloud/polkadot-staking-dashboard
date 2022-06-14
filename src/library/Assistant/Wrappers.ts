// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { motion } from 'framer-motion';
import styled from 'styled-components';
import { MAX_ASSISTANT_INTERFACE_WIDTH } from 'consts';
import {
  textPrimary,
  textSecondary,
  assistantButton,
  assistantBackground,
  networkColor,
} from 'theme';

export const Wrapper = styled(motion.div)<any>`
  position: fixed;
  right: -600px;
  top: 0;
  width: 100%;
  max-width: ${MAX_ASSISTANT_INTERFACE_WIDTH}px;
  height: auto;
  max-height: 100%;
  z-index: 8;
  display: flex;
  flex-flow: column nowrap;
  overflow: hidden;
  box-sizing: border-box;
  * {
    box-sizing: border-box;
  }
`;

export const CardsWrapper = styled(motion.div)`
  width: 200%;
  display: flex;
  flex-flow: row nowrap;
  overflow: auto;
  position: relative;
  flex: 1;
`;

export const ContentWrapper = styled.div`
  background: ${assistantBackground};
  backdrop-filter: blur(4px);
  border-radius: 1rem;
  display: flex;
  flex-flow: column nowrap;
  flex-basis: 100%;
  margin: 0.75rem;
  overflow: hidden;
  max-height: 100%;
`;

export const HeightWrapper = styled.div<any>`
  transition: ${(props) =>
    props.transition ? 'height 0.4s cubic-bezier(0.1, 1, 0.2, 1)' : 'none'};
  width: 100%;
  max-height: 100%;
  overflow: auto;
  overflow-x: hidden;
`;

export const CardWrapper = styled(motion.div)`
  display: flex;
  flex-flow: column nowrap;
  flex-basis: 100%;
`;

export const HeaderWrapper = styled.div`
  width: 100%;
  .hold {
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    align-items: center;
    height: 3rem;
    flex-shrink: 0;
    margin: 0;
  }
  button {
    color: ${textPrimary};
    font-size: 1rem;
    font-variation-settings: 'wght' 575;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    align-items: center;

    &.close {
      border: 1px solid ${textPrimary};
      border-radius: 1rem;
      padding: 0.3rem 0.75rem;
      margin-right: 0.5rem;
      font-size: 0.9rem;
    }
  }

  span {
    flex-grow: 1;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-end;
    align-items: center;
  }
  svg {
    margin-left: 0.5rem;
  }

  h3 {
    padding: 0 1rem;
  }
`;

export const ListWrapper = styled(motion.div)`
  display: flex;
  flex-flow: row wrap;
  flex-grow: 1;
  align-content: flex-start;
  overflow: auto;
  padding: 0.75rem 0.5rem;

  > button {
    padding: 0.25rem;
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    color: ${textPrimary};
  }
  h2 {
    color: ${textPrimary};
    padding: 0 0.75rem;
    margin: 0.5rem 0;
  }
  p {
    color: ${textPrimary};
  }
  .definition {
    color: ${textPrimary};
    padding: 0.75rem;
    line-height: 1.4rem;
    margin: 0;
  }
`;

export const HeadingWrapper = styled.div`
  width: 100%;
  padding: 0 0.6rem;
  > h4 {
    margin: 0.5rem 0 0;
    padding: 0.5rem 0;
    font-variation-settings: 'wght' 575;
    color: ${textSecondary};
  }
`;

export const DefinitionWrapper = styled(motion.div)<any>`
  width: 100%;
  display: flex;

  > button {
    background: ${assistantButton};
    border-radius: 0.75rem;
    margin: 0.45rem;
    padding: 1rem;
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    position: relative;
    flex: 1;

    > div:first-child {
      display: flex;
      flex-flow: column wrap;
      align-items: flex-start;
      justify-content: center;
      flex: 1;

      > h3 {
        color: ${textPrimary};
        font-size: 1rem;
        margin: 0;
        text-align: left;
      }
      > p {
        color: ${textPrimary};
        font-variation-settings: 'wght' 420;
        margin: 0.5rem 0 0 0;
        text-align: left;
      }
    }

    p.icon {
      opacity: 0.5;
    }
  }
`;

export const ItemWrapper = styled(motion.div)<any>`
  display: flex;
  width: ${(props) => props.width};
  height: ${(props) => (props.height === undefined ? '160px' : props.height)};
  overflow: auto;
  flex-flow: row wrap;
  justify-content: flex-start;

  p.icon {
    opacity: 0.5;
  }

  > * {
    background: ${assistantButton};
    border-radius: 0.75rem;
    flex: 1;
    padding: 0 0.8rem;
    display: flex;
    flex-flow: column nowrap;
    align-items: flex-start;
    justify-content: flex-start;
    margin: 0.4rem;
    position: relative;

    > h4 {
      color: ${textPrimary};
      font-weight: normal;
      margin: 0.65rem 0;
      text-transform: uppercase;
      font-size: 0.7rem;
    }
    > h3 {
      color: ${textPrimary};
      margin: 0;
      text-align: left;
    }

    > p {
      color: ${textPrimary};
      font-variation-settings: 'wght' 420;
      text-align: left;
    }

    .ext {
      position: absolute;
      bottom: 0.7rem;
      right: 0.7rem;
    }

    &.action {
      background: ${networkColor};
      > h4 {
        color: white;
      }
      > h3 {
        color: white;
      }
      > p {
        color: white;
      }
    }
  }
`;

export default Wrapper;
