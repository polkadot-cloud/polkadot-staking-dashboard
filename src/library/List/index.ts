// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { borderPrimary, networkColor, textPrimary, textSecondary } from 'theme';
import { ListProps, PaginationWrapperProps } from './types';

export const Wrapper = styled.div`
  display: flex;
  width: 100%;
  flex-flow: column nowrap;
`;

export const Header = styled.div`
  border-bottom: 1px solid ${borderPrimary};
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-end;
  padding: 0 0.25rem 0.5rem 0.25rem;
  flex: 1;

  h4 {
    color: ${textSecondary};
    margin: 0;
  }

  > div {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
  }

  > div:first-child {
    justify-content: flex-start;
  }

  > div:last-child {
    justify-content: flex-end;
    flex: 1;

    button {
      color: ${textSecondary};
      font-size: 1.1rem;
      margin: 0 0.5rem 0 0.75rem;
      opacity: 0.6;
      transition: all 0.2s;

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

  h4 {
    margin: 0;
  }

  > div:first-child {
    display: flex;
    justify-content: flex-start;
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
        color: ${(props) => (props.next ? networkColor : textSecondary)};
        cursor: ${(props) => (props.next ? 'pointer' : 'default')};
        opacity: ${(props) => (props.next ? 1 : 0.4)};
      }
      &.prev {
        color: ${(props) => (props.prev ? networkColor : textSecondary)};
        cursor: ${(props) => (props.prev ? 'pointer' : 'default')};
        opacity: ${(props) => (props.prev ? 1 : 0.4)};
      }
    }
  }
`;

export const SelectableWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;

  > button {
    border: 1px solid ${borderPrimary};
    font-size: 1rem;
    color: ${textSecondary};
    border-radius: 1rem;
    padding: 0.45rem 1rem;
    margin-right: 0.5rem;
    margin-bottom: 0.75rem;

    > svg {
      margin-right: 0.5rem;
    }

    &:disabled {
      opacity: 0.5;
    }

    &:hover {
      color: ${textPrimary};
    }
  }
`;

export const List = styled.div<ListProps>`
  margin-top: 1rem;
  width: 100%;

  .search {
    width: 100%;
    margin: 0.25rem 0 0.75rem 0;
    display: flex;
    flex-flow: row wrap;

    > input {
      border: 1.75px solid ${borderPrimary};
      border-radius: 1.75rem;
      padding: 0.75rem 1.25rem;
      font-size: 1.15rem;
      font-variation-settings: 'wght' 525;
      &:focus {
        border-width: 1.75px;
      }
    }
  }

  > div {
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    align-items: flex-start;

    > .item {
      display: flex;
      flex-flow: row nowrap;
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
          flex-basis: ${(props) => props.flexBasisLarge};
          max-width: ${(props) => props.flexBasisLarge};
        }
      }
    }
  }
`;

export default List;
