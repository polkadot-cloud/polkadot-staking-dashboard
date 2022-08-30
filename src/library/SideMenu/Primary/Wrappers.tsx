// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { motion } from 'framer-motion';
import styled from 'styled-components';
import {
  highlightPrimary,
  highlightSecondary,
  success,
  warning,
  successTransparent,
  warningTransparent,
} from 'theme';
import { MinimisedProps } from '../types';

export const Wrapper = styled(motion.div)<MinimisedProps>`
  box-sizing: border-box;
  border-radius: 0.7rem;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: center;
  padding: 0rem 0.5rem;
  margin: 0.4rem 0.2rem 0.3rem 0;
  position: relative;
  height: 3.3rem;

  .icon {
    margin-left: ${(props) => (props.minimised ? 0 : '0.25rem')};
    margin-right: 0.65rem;
  }
  .name {
    margin: 0;
    padding: 0;
    line-height: 1.35rem;
  }
  .action {
    color: ${success};
    flex: 1;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-end;
    margin-right: 0.4rem;
    font-size: 0.88rem;
    opacity: 0.7;

    > span {
      &.success {
        color: ${success};
        border: 1px solid ${successTransparent};
      }
      &.warning {
        color: ${warning};
        border: 1px solid ${warningTransparent};
      }
      box-sizing: border-box;
      border-radius: 0.35rem;
      padding: 0.15rem 0.5rem;
    }

    &.success {
      svg {
        color: ${success};
      }
    }
    &.warning {
      svg {
        color: ${warning};
      }
    }
  }

  &.active {
    background: ${highlightPrimary};
  }
  &.inactive:hover {
    background: ${highlightSecondary};
  }
`;

export const MinimisedWrapper = styled(motion.div)`
  box-sizing: border-box;
  border-radius: 0.5rem;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
  padding: 0.7rem 0rem;
  margin: 0.8rem 0.2rem 0.3rem 0;
  font-size: 1.1rem;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0);

  &.action-success {
    border: 1px solid ${successTransparent};
  }
  &.action-warning {
    border: 1px solid ${warningTransparent};
  }
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
