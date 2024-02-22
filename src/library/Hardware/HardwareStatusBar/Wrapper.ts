// // Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { motion } from 'framer-motion';
import styled from 'styled-components';

export const Wrapper = styled(motion.div)`
  padding: 0 0.5rem 0.5rem;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 10;

  > .inner {
    background: var(--background-list-item);
    border-radius: 1rem;
    display: flex;
    align-items: center;
    padding: 0.7rem 1rem;

    > section {
      display: flex;
      align-items: center;

      &:first-child {
        flex-grow: 1;

        > .icon {
          color: var(--text-color-secondary);
          margin: 0 1rem 0 0.25rem;
        }

        > .text {
          flex: 1;
          flex-direction: column;
        }
      }

      &:last-child {
        flex-shrink: 1;
        justify-content: flex-end;

        > button {
          margin-left: 0.75rem;
        }
      }
    }

    h3,
    h5 {
      display: flex;
      align-items: center;
      flex: 1;
    }

    h5 {
      margin-top: 0.25rem;
    }
  }
`;
