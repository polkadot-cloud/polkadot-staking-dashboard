// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  assistantButton,
  modalOverlayBackground,
  networkColor,
  textPrimary,
  textSecondary,
} from 'theme';

// Blurred background modal wrapper
export const Wrapper = styled(motion.div)`
  background: ${modalOverlayBackground};
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 9;
  backdrop-filter: blur(14px);

  > div {
    box-sizing: border-box;
    height: 100%;
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    align-items: center;
    padding: 0 2rem;

    /* click anywhere behind modal content to close */
    .close {
      position: fixed;
      width: 100%;
      height: 100%;
      z-index: 8;
      cursor: default;
    }
  }
`;

export const HeightWrapper = styled.div`
  width: 100%;
  height: 100%;
  max-width: 800px;
  z-index: 9;
  position: relative;
  overflow: scroll;

  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

export const ContentWrapper = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: auto;
  overflow: hidden;
  position: relative;
  padding: 4rem 0;

  > .buttons {
    width: 100%;
    display: flex;
    flex-flow: row wrap;
    margin-bottom: 2rem;
    position: relative;

    > button {
      > svg {
        margin-right: 0.5rem;
      }
      color: ${networkColor};
      border: 1px solid ${networkColor};
      border-radius: 1.5rem;
      padding: 0.4rem 0.8rem;
      margin-right: 1.25rem;
      margin-left: 0;
    }
  }

  h1 {
    font-family: 'Unbounded', 'sans-serif', sans-serif;
    margin-bottom: 1.75rem;
  }

  h3 {
    margin: 2rem 0.5rem 1rem 0.5rem;
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
    color: ${textPrimary};
    padding: 0.25rem;
    display: flex;
    flex-flow: row wrap;
    align-items: center;
  }
  h2 {
    color: ${textPrimary};
    padding: 0 0.75rem;
    margin: 0.5rem 0;
    width: 100%;
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

export const DefinitionWrapper = styled(motion.div)`
  box-sizing: border-box;
  width: 100%;
  display: flex;
  background: ${assistantButton};
  border-radius: 1.5rem;
  margin-bottom: 1.25rem;
  padding: 1.5rem 1.5rem 0 1.5rem;
  flex-flow: row wrap;
  align-items: center;
  position: relative;
  overflow: hidden;
  flex: 1;

  button {
    padding: 0;
  }

  h2 {
    margin: 0 0 1.5rem 0;
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    > span {
      color: ${textSecondary};
      margin-left: 0.75rem;
      opacity: 0.75;
      font-size: 1.1rem;
    }
  }

  h4 {
    margin-top: 0;
  }

  p {
    color: ${textPrimary};
    margin: 0.5rem 0 0 0;
    text-align: left;
  }

  p.icon {
    opacity: 0.5;
  }
`;

export const ItemWrapper = styled(motion.div)<any>`
  display: flex;
  width: ${(props) => props.width};
  height: ${(props) => (props.height === undefined ? '160px' : props.height)};
  overflow: auto;
  flex-flow: row wrap;
  justify-content: flex-start;

  > * {
    background: ${assistantButton};
    border-radius: 1.5rem;
    flex: 1;
    padding: 1.5rem;
    display: flex;
    flex-flow: column nowrap;
    align-items: flex-start;
    justify-content: flex-start;
    margin-bottom: 1.5rem;
    position: relative;

    > h4 {
      color: ${textPrimary};
      font-weight: normal;
      margin: 0.65rem 0;
      text-transform: uppercase;
      font-size: 0.7rem;
    }
    > h2 {
      color: ${textPrimary};
      margin: 0;
      text-align: left;
    }

    > p {
      color: ${textPrimary};
      text-align: left;

      &.icon {
        color: ${networkColor};
        margin-bottom: 0;
      }
    }

    .ext {
      margin-right: 0.75rem;
    }
  }
`;
