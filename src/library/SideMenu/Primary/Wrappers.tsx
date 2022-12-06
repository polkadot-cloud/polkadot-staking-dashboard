// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { motion } from 'framer-motion';
import styled from 'styled-components';
import {
  highlightPrimary,
  highlightSecondary,
  networkColor,
  success,
  textPrimary,
  warning,
  warningTransparent,
} from 'theme';
import { MinimisedProps } from '../types';

export const Wrapper = styled(motion.div)<MinimisedProps>`
  border-radius: 0.7rem;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: center;
  padding: 0rem 0.5rem;
  margin: 0.4rem 0.2rem 0.3rem 0;
  position: relative;
  height: 3.2rem;

  .icon {
    margin-left: ${(props) => (props.minimised ? 0 : '0.25rem')};
    margin-right: 0.65rem;

    .fa-icon {
      margin: 0 0.15rem;
    }

    .lpf {
      fill: ${textPrimary};
    }
    .lps {
      stroke: ${textPrimary};
    }
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

    > span {
      &.success {
        color: ${networkColor};
        border: 1px solid ${networkColor};
      }
      &.warning {
        color: ${warning};
        border: 1px solid ${warningTransparent};
      }
      border-radius: 0.5rem;
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
  border-radius: 0.5rem;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
  padding: 0.65rem 0rem;
  margin: 0.7rem 0.2rem 0.5rem 0;
  font-size: 1.1rem;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0);

  &.action-success {
    border: 1px solid ${networkColor};
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

    .lpf {
      fill: ${textPrimary};
    }
    .lps {
      stroke: ${textPrimary};
    }
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
