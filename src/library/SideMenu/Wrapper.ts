// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import {
  SIDE_MENU_MAXIMISED_WIDTH,
  SIDE_MENU_MINIMISED_WIDTH,
  SIDE_MENU_STICKY_THRESHOLD,
} from 'consts';
import {
  textSecondary,
  backgroundOverlay,
  borderPrimary,
  networkColor,
  modalBackground,
} from 'theme';
import { MinimisedProps } from './types';

export const Wrapper = styled.div<MinimisedProps>`
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
      flex-flow: ${(props) => (props.minimised ? 'column wrap' : 'row wrap')};
      align-items: center;
      padding-top: 0.5rem;

      button {
        position: relative;
        color: ${textSecondary};
        transition: color 0.2s;
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

export const LogoWrapper = styled.button<MinimisedProps>`
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

export const Separator = styled.div`
  border-bottom: 1px solid ${borderPrimary};
  width: 100%;
  margin: 1rem 1rem 0.5rem 0;
`;

export const ConnectionSymbol = styled.div<{ color: any }>`
  width: 0.6rem;
  height: 0.6rem;
  background: ${(props) => props.color};
  border-radius: 50%;
  margin: 0 0.7rem;
`;
