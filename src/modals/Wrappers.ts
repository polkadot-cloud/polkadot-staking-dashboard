// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { motion } from 'framer-motion';
import styled from 'styled-components';
import {
  borderPrimary,
  cardBorder,
  cardShadow,
  modalBackground,
  modalOverlayBackground,
  networkColor,
  shadowColor,
  textSecondary,
} from 'theme';

// Blurred background modal wrapper
export const ModalWrapper = styled(motion.div)`
  background: ${modalOverlayBackground};
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 9;
  backdrop-filter: blur(4px);

  /* modal content wrapper */
  > div {
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

export const HeightWrapper = styled.div<{ size: string }>`
  border: ${cardBorder} ${borderPrimary};
  box-shadow: ${cardShadow} ${shadowColor};
  transition: height 0.5s cubic-bezier(0.1, 1, 0.2, 1);
  box-sizing: border-box;
  width: 100%;
  max-width: ${(props) =>
    props.size === 'xl'
      ? '1250px'
      : props.size === 'large'
      ? '800px'
      : '600px'};
  max-height: 100%;
  border-radius: 1.5rem;
  z-index: 9;
  position: relative;
`;

// Modal content wrapper
export const ContentWrapper = styled.div`
  box-sizing: border-box;
  background: ${modalBackground};
  width: 100%;
  height: auto;
  overflow: hidden;
  position: relative;

  a {
    color: ${networkColor};
  }
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
  .notes {
    padding: 1rem 0;
    > p {
      color: ${textSecondary};
    }
  }
`;

// generic wrapper for modal padding
export const PaddingWrapper = styled.div<{
  verticalOnly?: boolean;
  horizontalOnly?: boolean;
}>`
  box-sizing: border-box;
  display: flex;
  flex-flow: column wrap;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  padding: ${(props) =>
    props.verticalOnly
      ? '1rem 0'
      : props.horizontalOnly
      ? '0 1rem'
      : '1rem 1.25rem'};
`;

// modal header, used for extrinsics forms
export const HeadingWrapper = styled.h3<{ noPadding?: boolean }>`
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  margin-top: 0.25rem;
  padding: ${(props) => (props.noPadding ? '0' : '0 1rem')};
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

  h3 {
    color: ${textSecondary};
    opacity: 0.5;
    margin: 0;
    &.active {
      opacity: 1;
      color: ${networkColor};
    }
  }

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
    &.primary {
      color: white;
      background: ${networkColor};
      border: 1px solid ${networkColor};
    }
    &.secondary {
      color: ${networkColor};
      border: 1px solid ${networkColor};
    }

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

export const NotesWrapper = styled.div`
  width: 100%;
  padding: 1rem 0;
  > p {
    color: ${textSecondary};
  }
`;
