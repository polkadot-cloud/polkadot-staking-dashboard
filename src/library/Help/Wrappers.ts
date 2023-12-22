// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { motion } from 'framer-motion';
import styled from 'styled-components';

export const ListWrapper = styled(motion.div)`
  display: flex;
  flex-flow: row wrap;
  flex-grow: 1;
  overflow: auto;
  padding: 0.75rem 0.5rem;

  > button {
    color: var(--text-color-primary);
    padding: 0.25rem;
    display: flex;
    flex-flow: row wrap;
    align-items: center;
  }
  h2 {
    color: var(--text-color-primary);
    padding: 0 0.75rem;
    margin: 0.5rem 0;
    width: 100%;
  }
  p {
    color: var(--text-color-primary);
  }
  .definition {
    color: var(--text-color-primary);
    padding: 0.75rem;
    line-height: 1.4rem;
    margin: 0;
  }
`;

export const DefinitionWrapper = styled(motion.div)`
  background: var(--background-floating-card);
  border-radius: 1.5rem;
  display: flex;
  flex-flow: row wrap;
  flex: 1;
  overflow: hidden;
  margin-bottom: 1.25rem;
  padding: 1.5rem 1.5rem 0 1.5rem;
  width: 100%;

  button {
    padding: 0;
    h2 {
      margin: 0 0 1.5rem 0;
      display: flex;
      flex-flow: row wrap;
      align-items: center;

      > span {
        color: var(--text-color-secondary);
        margin-left: 0.75rem;
        opacity: 0.75;
        font-size: 1.1rem;
      }
    }
  }

  > div {
    position: relative;
    transition: height 0.4s cubic-bezier(0.1, 1, 0.2, 1);
    width: 100%;

    > .content {
      position: absolute;
    }

    h4 {
      font-family: InterSemiBold, sans-serif;
      margin-bottom: 1.15rem;
    }

    p {
      color: var(--text-color-primary);
      margin: 0.5rem 0 0 0;
      text-align: left;
    }

    p.icon {
      opacity: 0.5;
    }
  }
`;

export const ItemWrapper = styled(motion.div)<{
  width: string | number;
}>`
  display: flex;
  width: ${(props) => props.width};
  height: auto;
  overflow: hidden;
  flex-flow: row wrap;

  > * {
    background: var(--background-floating-card);
    border-radius: 1.5rem;
    flex: 1;
    padding: 1.5rem;
    display: flex;
    flex-flow: column nowrap;
    margin-bottom: 1.5rem;
    position: relative;

    > h2 {
      color: var(--text-color-primary);
      text-align: left;
    }
    > h4 {
      color: var(--text-color-primary);
      margin: 0.65rem 0;
      text-transform: uppercase;
      font-size: 0.7rem;
    }

    > p {
      color: var(--text-color-primary);
      text-align: left;

      &.icon {
        color: var(--accent-color-primary);
        margin-bottom: 0;
      }
    }

    .ext {
      margin-right: 0.75rem;
    }
  }
`;
