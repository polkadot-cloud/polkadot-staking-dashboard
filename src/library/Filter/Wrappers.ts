// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const Wrapper = styled.div`
  padding: 0 0.5rem;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-wrap: nowrap;
  height: 3rem;
  margin-bottom: 0.5rem;

  > .hide-scrollbar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;

    > div {
      display: flex;
      flex-wrap: nowrap;
      overflow: auto;
      width: 100%;
      padding-bottom: 3rem;

      > .items {
        display: flex;
        > button {
          padding: 0 0.25rem;
        }
      }
    }
  }
`;

export const ItemWrapper = styled.div`
  border: 1px solid var(--border-primary-color);
  font-family: InterSemiBold, sans-serif;
  border-radius: 1.5rem;
  display: flex;
  position: relative;
  padding: 0.6rem 1rem;
  margin-right: 1rem;
  align-items: center;
  width: max-content;

  &:last-child {
    margin-right: 0;
  }
  .icon {
    color: var(--text-color-secondary);
    display: flex;
    flex-flow: column wrap;
    justify-content: center;
    align-items: center;
    margin-right: 0.55rem;
  }
  p {
    color: var(--text-color-secondary);
    font-size: 0.9rem;
    margin: 0;
    text-align: left;
    line-height: 0.95rem;
  }
`;

export const LargeItemWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  padding: 0.5rem;
  > .inner {
    border: 1.5px solid var(--border-primary-color);
    background: var(--background-list-item);
    border-radius: 1.25rem;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    position: relative;
    padding: 1rem 1.25rem;

    &:last-child {
      margin-right: 0;
    }

    > section {
      width: 100%;
      display: flex;
      flex-flow: row wrap;
      align-items: center;
    }
    svg {
      color: var(--accent-color-primary);
      margin-right: 0.75rem;
    }
    p {
      color: var(--text-color-secondary);
      margin: 0;
      text-align: left;
      padding: 0.5rem 0 0 0;
    }
  }
`;

export const TabsWrapper = styled.div`
  display: flex;
  margin-bottom: 0.75rem;

  > button {
    &:first-child {
      border-top-left-radius: 1.5rem;
      border-bottom-left-radius: 1.5rem;
    }
    &:last-child {
      border-top-right-radius: 1.5rem;
      border-bottom-right-radius: 1.5rem;
    }
  }
`;

export const TabWrapper = styled.button<{ $active?: boolean }>`
  font-family: InterSemiBold, sans-serif;
  border: 1px solid
    ${(props) =>
      props.$active
        ? 'var(--accent-color-primary)'
        : 'var(--border-primary-color)'};
  color: ${(props) =>
    props.$active
      ? 'var(--accent-color-primary)'
      : 'var(--text-color-secondary)'};
  font-size: 0.9rem;
  padding: 0.5rem 1.25rem;
`;
