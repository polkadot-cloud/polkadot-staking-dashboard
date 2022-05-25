// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  textSecondary,
  modalOverlayBackground,
  modalBackground,
} from '../theme';

// Blurred background modal wrapper
export const ModalWrapper = styled(motion.div)`
  background: ${modalOverlayBackground};
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 9;
  backdrop-filter: blur(4px);

  /* modal content wrapper */
  .content_wrapper {
    box-sizing: border-box;
    height: 100%;
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    align-items: center;
    padding: 1rem 2rem;

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

export const HeightWrapper = styled.div<any>`
  transition: height 0.6s cubic-bezier(0.1, 1, 0.2, 1);
  box-sizing: border-box;
  width: 100%;
  max-width: ${(props) => (props.size === 'large' ? '800px' : '600px')};
  max-height: 100%;
  overflow: hidden;
  z-index: 9;
  position: relative;
`;

// Modal content wrapper
export const ContentWrapper = styled.div<any>`
  box-sizing: border-box;
  background: ${modalBackground};
  width: 100%;
  height: auto;
  border-radius: 0.75rem;
  overflow: hidden;
  overflow-y: scroll;
  position: relative;

  .header {
    width: 100%;
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    padding: 1rem 1rem 0 1rem;
  }
  .body {
    padding: 1rem;
  }
`;

// modal header, used for extrinsics forms
export const HeadingWrapper = styled.h3`
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  margin-top: 0.25rem;
  padding: 0 1rem;
  color: ${textSecondary};
  flex: 1;

  > svg {
    margin-right: 0.75rem;
  }
`;

// modal footer, used for extrinsics forms
export const FooterWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  margin-top: 1rem;

  > div {
    margin-left: 1rem;
  }
  .submit {
    padding: 0.5rem 0.75rem;
    border-radius: 0.7rem;
    font-size: 1rem;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    color: rgba(211, 48, 121, 0.85);
    border: 1px solid rgba(211, 48, 121, 0.85);

    &:disabled {
      opacity: 0.25;
    }
    svg {
      margin-right: 0.5rem;
    }
  }
`;

export const Separator = styled.div`
  border-top: 1px solid ${textSecondary};
  width: 100%;
  opacity: 0.1;
  margin: 0.75rem 0rem;
`;
