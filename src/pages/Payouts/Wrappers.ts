// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { backgroundValidator, borderSecondary, textSecondary, primary } from '../../theme';

export const ItemWrapper = styled(motion.div) <any>`
  padding: 0.5rem;
  display: flex;
  flex-flow: row nowrap;
  width: 100%;

  > div {
    padding: 0.75rem 0.5rem;
    flex: 1;
    background: ${backgroundValidator};
    border-radius: 0.75rem;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    align-items: center;
    flex: 1;
    max-width: 100%;

    h4 {
      margin: 0 0.75rem;
      color: ${textSecondary};

      &.reward {
        color: ${primary};
      }
    }

    span {
      border-radius: 0.65rem;
      padding: 0.1rem 0.6rem;
      display: flex;
      flex-flow: row wrap;
      justify-content: center;
      align-items: center;

      h4 {
        color: ${textSecondary};
        opacity: 0.6;
        margin: 0;
      }
    }

    > div:first-child {
      flex-grow: 1;
      display: flex;
      flex-flow: row wrap;
      justify-content: flex-start;
      align-items: center;
    }

    > div:last-child {
      display: flex;
      flex-flow: row wrap;
      justify-content: flex-end;

      > h4 {
        color: ${textSecondary};
        opacity: 0.8;
      }
    }
  }
`;