// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { motion } from 'framer-motion';
import styled from 'styled-components';
import {
  SIDE_MENU_MAXIMISED_WIDTH,
  SIDE_MENU_MINIMISED_WIDTH,
  SIDE_MENU_STICKY_THRESHOLD,
} from 'consts';
import {
  textSecondary,
  highlightPrimary,
  highlightSecondary,
  backgroundOverlay,
  networkColor,
  modalBackground,
} from 'theme';

export const Wrapper = styled.div<any>`
  box-sizing: border-box;
  border-radius: ${(props) => (props.minimised ? '0.7rem' : 0)};
  background: none;
  padding: 1rem 1rem 1rem 1.25rem;
  overflow: auto;
  flex-grow: 1;
  margin: 0.75rem 0 3.35rem 0rem;
  display: flex;
  flex-flow: column nowrap;
  backdrop-filter: blur(4px);
  width: ${(props) =>
    props.minimised
      ? `${SIDE_MENU_MINIMISED_WIDTH}px`
      : `${SIDE_MENU_MAXIMISED_WIDTH}px`};

  @media (max-width: ${SIDE_MENU_STICKY_THRESHOLD}px) {
    background: ${backgroundOverlay};
    transition: all 0.2s;
    border-radius: 0.75rem;
  }

  section {
    &:first-child {
      flex-grow: 1;
    }
    /* Footer */
    &:last-child {
      display: flex;
      flex-flow: ${(props) =>
        props.minimised ? 'column-reverse wrap' : 'row wrap'};
      align-items: center;
      padding-top: 0.5rem;

      button {
        position: relative;
        color: ${textSecondary};
        transition: color 0.2s;
        margin-right: ${(props) => (props.minimised ? 0 : '0.1rem')};
        margin-top: ${(props) => (props.minimised ? '1.25rem' : 0)};
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

export const LogoWrapper = styled.button<any>`
  display: flex;
  flex-flow: row wrap;
  justify-content: ${(props) => (props.minimised ? 'center' : 'flex-start')};
  width: 100%;
  height: 2.8rem;
  padding: ${(props) => (props.minimised ? '0' : '0.4rem 0.5rem')};
  margin-bottom: ${(props) => (props.minimised ? '1.5rem' : '1rem')};
  position: relative;

  > .beta {
    color: ${networkColor};
    position: absolute;
    top: -7px;
    font-size: 0.7rem;
  }

  > .beta-min {
    color: ${networkColor};
    background: ${modalBackground};
    position: absolute;
    right: 0px;
    z-index: 2;
    font-size: 0.6rem;
    padding: 0.1rem 0.45rem;
    border-radius: 0.5rem;
  }
  ellipse {
    fill: ${networkColor};
  }
`;

export const HeadingWrapper = styled.div<any>`
  display: flex;
  flex-flow: row wrap;
  justify-content: ${(props) => (props.minimised ? 'center' : 'flex-start')};
  opacity: ${(props) => (props.minimised ? 0.5 : 1)};
  align-items: center;

  h5 {
    color: ${textSecondary};
    margin: 1.1rem 0 0.2rem 0;
    padding: 0 0.5rem;
    opacity: 0.7;
  }
`;

export const ItemWrapper = styled(motion.div)<any>`
  box-sizing: border-box;
  border-radius: 0.7rem;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: center;
  padding: 0.9rem 0.5rem;
  margin: 0.3rem 0.2rem 0.3rem 0;
  font-size: 1.04rem;
  position: relative;

  .icon {
    margin-left: ${(props) => (props.minimised ? 0 : '0.25rem')};
    margin-right: 0.65rem;
  }
  .name {
    margin: 0;
    padding: 0;
  }
  .action {
    flex: 1;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-end;
    margin-right: 0.3rem;
  }

  &.active {
    background: ${highlightPrimary};
  }
  &.inactive:hover {
    background: ${highlightSecondary};
  }
`;

export const MinimisedItemWrapper = styled(motion.div)`
  border-radius: 0.5rem;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
  padding: 0.9rem 0rem;
  margin: 0.3rem 0.2rem 0.3rem 0;
  font-size: 1.04rem;
  position: relative;

  &.active {
    background: ${highlightPrimary};
  }
  &.inactive:hover {
    background: ${highlightSecondary};
  }
  .icon {
    margin: 0;
  }
  .action {
    &.minimised {
      > svg {
        flex: 0;
        position: absolute;
        top: -4px;
        right: -3px;
      }
    }
  }
`;

export const PalettePosition = styled.div`
  position: absolute;
  right: 10px;
  top: -150px;
`;

export default Wrapper;
