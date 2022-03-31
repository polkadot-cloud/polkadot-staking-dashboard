// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  width: 100%;
  flex-flow: column nowrap;
`;

export const Header = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-end;
  padding: 0 0.25rem 0.5rem 0.25rem;
  flex: 1;
  border-bottom: 1px solid #eee;

  h3 {
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
      font-size: 1.1rem;
      margin-left: 0.4rem;
      opacity: 0.6;
      transition: all 0.2s;

      &:hover {
        opacity: 0.9
      }
    }
  }
`;

export const Pagination = styled.div<any>`
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
      margin-left: 0.5rem;
      &.next {
        color: ${props => props.next ? 'rgb(211, 48, 121)' : '#aaa'};
        cursor: ${props => props.next ? 'pointer' : 'default'};
      }
      &.prev {
        color: ${props => props.prev ? 'rgb(211, 48, 121)' : '#aaa'};
        cursor: ${props => props.prev ? 'pointer' : 'default'};
      }
    }
  }
`;

export const List = styled.div<any>`
  margin-top: 1rem;
  width: 100%;

  .transition {
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
        @media(min-width: 650px) {
          flex-basis: 50%;
        }
        @media(min-width: 1250px) {
          flex-basis: ${props => props.flexBasisLarge};
        }
      }
    }
  }
`;

export default List;