// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { motion } from 'framer-motion';
import styled from 'styled-components';
import { buttonPrimaryBackground, textSecondary } from 'theme';

export const Wrapper = styled.div`
  display: flex;
  flex-flow: column wrap;
  align-items: flex-start;
  justify-content: flex-start;
`;

export const FixedContentWrapper = styled.div`
  padding-top: 1rem;
  width: 100%;
`;

export const CardsWrapper = styled(motion.div)`
  width: 200%;
  display: flex;
  overflow: hidden;
  overflow-y: auto;
  position: relative;
  height: 100%;
`;

export const ContentWrapper = styled.div`
  border-radius: 1rem;
  display: flex;
  flex-flow: column nowrap;
  flex-basis: 50%;
  flex: 1;
  padding: 0 1.25rem;

  > div:last-child {
    margin-bottom: 0;
  }
`;

export const ChunkWrapper = styled.div<any>`
  flex: 1;
  display: flex;
  flex-flow: column wrap;
  margin-top: 1.25rem;

  > div {
    display: flex;
    flex-flow: row wrap;
    width: 100%;
    padding: 0.5rem 1.25rem;
    border-radius: 1rem;
    background: ${buttonPrimaryBackground};

    > section {
      display: flex;
      flex-flow: column wrap;
      justify-content: flex-end;
      align-items: flex-start;
      padding: 0.75rem 0;

      &:first-child {
        flex-grow: 1;
      }
      &:last-child {
        justify-content: center;
      }
    }
  }

  h2 {
    margin: 0;
  }
  h4 {
    color: ${textSecondary};
    margin: 0.75rem 0 0 0;
  }
`;

export default Wrapper;
