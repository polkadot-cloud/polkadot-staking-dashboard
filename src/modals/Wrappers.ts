// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { motion } from 'framer-motion';
import styled from 'styled-components';

// Blurred background modal wrapper
export const ModalWrapper = styled(motion.div)`
  background: var(--overlay-modal-color);
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 9;
  backdrop-filter: blur(4px);

  /* modal content wrapper */
  > div {
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
  box-shadow: 0px 2px 8px 1px var(--card-shadow-color);
  transition: height 0.5s cubic-bezier(0.1, 1, 0.2, 1);
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
  background: var(--background-modal);
  width: 100%;
  height: auto;
  overflow: hidden;
  position: relative;

  h2 {
    &.unbounded {
      font-family: 'Unbounded';
    }
    &.title {
      font-size: 1.35rem;
      margin: 1.25rem 0 0 0;
    }
  }

  a {
    color: var(--network-color-primary);
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
      color: var(--text-color-secondary);
    }
  }
  .action-button {
    background: var(--button-primary-background);
    padding: 1rem;
    cursor: pointer;
    margin-bottom: 1rem;
    border-radius: 0.75rem;
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    transition: all 0.15s;
    width: 100%;

    &:last-child {
      margin-bottom: 0;
    }

    h3,
    p {
      text-align: left;
      margin: 0;
    }
    h3 {
      margin-bottom: 0.5rem;
    }
    > *:last-child {
      flex: 1;
      display: flex;
      flex-flow: row wrap;
      justify-content: flex-end;
    }
    &:hover {
      background: var(--button-toggle-background);
    }
    .icon {
      margin-right: 0.5rem;
    }
    p {
      color: var(--text-color-primary);
      font-size: 1rem;
    }
  }
`;

// generic wrapper for modal padding
export const PaddingWrapper = styled.div<{
  verticalOnly?: boolean;
  horizontalOnly?: boolean;
}>`
  display: flex;
  flex-flow: column wrap;
  width: 100%;
  padding: ${(props) =>
    props.verticalOnly
      ? '1rem 0 0.25rem 0'
      : props.horizontalOnly
      ? '0 1rem'
      : '1rem'};
`;

// modal header, used for extrinsics forms
export const HeadingWrapper = styled.h3<{ noPadding?: boolean }>`
  color: var(--text-color-secondary);
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  width: 100%;
  margin-top: 0.25rem;
  padding: ${(props) => (props.noPadding ? '0' : '0 1rem')};
  flex: 1;

  > svg {
    margin-right: 0.75rem;
  }
`;

// modal footer, used for extrinsics forms
export const FooterWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  width: 100%;

  h3 {
    color: var(--text-color-secondary);
    opacity: 0.5;
    margin: 0;
    position: relative;
    top: 1.25rem;
    &.active {
      opacity: 1;
      color: var(--network-color-primary);
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
    align-items: center;
    &.primary {
      color: white;
      background: var(--network-color-primary);
      border: 1px solid var(--network-color-primary);
    }
    &.secondary {
      color: var(--network-color-primary);
      border: 1px solid var(--network-color-primary);
    }

    &:disabled {
      opacity: var(--opacity-disabled);
    }
    svg {
      margin-right: 0.5rem;
    }
  }
`;

export const Separator = styled.div`
  border-top: 1px solid var(--text-color-secondary);
  width: 100%;
  opacity: 0.1;
  margin: 0.8rem 0rem 0.8rem 0;
`;

export const NotesWrapper = styled.div<{
  noPadding?: boolean;
}>`
  width: 100%;
  padding: ${(props) => (props.noPadding ? '0' : '0.75rem 0')};
  > p {
    color: var(--text-color-secondary);
  }
`;

export const WarningsWrapper = styled.div<{ noMargin?: boolean }>`
  margin-top: ${(props) => (props.noMargin ? '0' : '0.75rem')};
  width: 100%;
`;
