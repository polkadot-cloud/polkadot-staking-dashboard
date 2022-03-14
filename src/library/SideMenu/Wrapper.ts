// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { motion } from "framer-motion";
import styled from 'styled-components';

export const LogoWrapper = styled(motion.button)`
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  width: 100%;
  height: 2.1rem;
  padding: 0.4rem 0.5rem;
  margin-bottom: 1rem;
`;

export const Wrapper = styled.div`
  background: none;
  border-radius: 0.7rem;
  transition: all 0.2s;
  padding: 1rem 0.5rem;
  overflow: auto;
  flex: 1;
  margin: 1.2rem 0 1.2rem 1rem;
  min-width: 170px;
  &:hover {
    transform: scale(1.005);
  }
  display: flex;
  flex-flow: column nowrap;
  background: #eee;

  &:hover {
    /* background: #f6f6f6; */
  }

  section {
    &:first-child {
      flex-grow: 1;
    }
    /* Github icon */
    &:last-child {
      button {
        transition: color 0.2s;
        margin: 0 0.25rem;
        color: #666;
        &:hover {
        color: #555;
      }
    }
  }
}
`;

export const ItemWrapper = styled(motion.div) <any>`
  border-radius: 0.5rem;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: center;
  padding: 0.75rem 0.5rem;
  margin: 0.35rem 0;
  font-size: 1.08rem;

  &.active {
    background: rgba(0,0,0,0.04);
    background: linear-gradient(90deg, rgba(0,0,0,0.07) 0%, rgba(0,0,0,0.03) 100%);
  }

  &.inactive:hover {
    background: rgba(0,0,0,0.02);
    background: linear-gradient(90deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.01) 100%);
  }

  .icon {
    margin-right: 0.8rem;
  }

  .action {
    flex: 1;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-end;
  }
`;

export const HeadingWrapper = styled.div<any>`
  margin: 1.5rem 0 0.25rem 0;
  font-size: 0.95rem;
  padding: 0 0.5rem;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: center;
  opacity: 0.6;
`;

export const Separator = styled.div`
  border-bottom: 1px solid #e1e1e1;
  margin-bottom: 0.75rem;
  padding: 0 0.5rem;
`;

export default Wrapper;