// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';
import type { DisplayFor } from '@w3ux/types';
import type { ListProps, PaginationWrapperProps } from './types';

export const Wrapper = styled.div`
  display: flex;
  width: 100%;
  flex-flow: column nowrap;
`;

// NOTE: used for member lists and payout list only.
export const Header = styled.div<{ $displayFor?: DisplayFor }>`
  border-bottom: ${(props) =>
    props.$displayFor === 'canvas'
      ? '1px solid var(--border-secondary-color)'
      : '1px solid var(--border-primary-color)'};

  display: flex;
  flex-flow: row wrap;
  justify-content: flex-end;
  padding: 0 0.25rem 0.75rem 0.25rem;
  flex: 1;

  &.noBorder {
    border: none;
    padding-bottom: 0;
  }

  h4 {
    color: var(--text-color-secondary);
    font-family: InterSemiBold, sans-serif;
  }

  > div {
    display: flex;
    align-items: center;
  }

  > div:last-child {
    justify-content: flex-end;
    flex: 1;

    button {
      color: var(--text-color-secondary);
      font-size: 1.1rem;
      margin: 0 0.5rem 0 0.75rem;
      opacity: 0.6;
      transition: all var(--transition-duration);

      &:hover {
        opacity: 0.9;
      }
    }
  }
`;

export const PaginationWrapper = styled.div<PaginationWrapperProps>`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0.75rem 0.5rem;

  > div:first-child {
    display: flex;
    flex: 1;
  }

  > div:last-child {
    display: flex;
    justify-content: flex-end;

    button {
      font-size: 0.98rem;
      padding: 0 0.25rem;
      margin-left: 0.5rem;
      &.next {
        color: ${(props) =>
          props.$next
            ? 'var(--accent-color-primary)'
            : 'var(--text-color-secondary)'};
        cursor: ${(props) => (props.$next ? 'pointer' : 'default')};
        opacity: ${(props) => (props.$next ? 1 : 0.4)};
      }
      &.prev {
        color: ${(props) =>
          props.$prev
            ? 'var(--accent-color-primary)'
            : 'var(--text-color-secondary)'};
        cursor: ${(props) => (props.$prev ? 'pointer' : 'default')};
        opacity: ${(props) => (props.$prev ? 1 : 0.4)};
      }
    }
  }
`;

export const SelectableWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0 0.15rem;
  margin-top: 0.5rem;

  > button {
    margin-bottom: 0.75rem;
  }
`;

export const ListStatusHeader = styled.h4`
  padding: 0.25rem 0.5rem;
`;

export const List = styled.div<ListProps>`
  width: 100%;

  > div {
    display: flex;
    flex-wrap: wrap;

    > .item {
      display: flex;
      align-items: center;
      overflow: hidden;

      &.row {
        flex-basis: 100%;
      }

      &.col {
        flex-grow: 1;
        flex-basis: 100%;
        @media (min-width: 875px) {
          flex-basis: 50%;
          max-width: 50%;
        }
        @media (min-width: 1500px) {
          flex-basis: ${(props) => props.$flexBasisLarge};
          max-width: ${(props) => props.$flexBasisLarge};
        }
      }
    }
  }
`;

export const SearchInputWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  margin: 0.5rem 0 2rem 0;
  width: 100%;

  > input {
    border: 1px solid var(--border-primary-color);
    color: var(--text-color-secondary);
    font-family: InterBold, sans-serif;
    border-radius: 1.75rem;
    padding: 0.9rem 1.25rem;
    font-size: 1.15rem;
    width: 100%;
  }
`;

export const FilterHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0 0.25rem;

  > div {
    display: flex;

    &:first-child {
      flex-grow: 1;
      flex-direction: column;
    }
    &:last-child {
      flex-shrink: 1;

      button {
        color: var(--text-color-secondary);
        font-size: 1.1rem;
        margin: 0 0.5rem 0 0.75rem;
        opacity: 0.6;
        transition: all var(--transition-duration);

        &:hover {
          opacity: 0.9;
        }
      }
    }
  }
`;
