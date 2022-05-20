// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { textSecondary, borderPrimary } from '../../../theme';

export const Wrapper = styled.div`
  box-sizing: border-box;
  padding: 0.25rem 0.5rem 1rem 0.5rem;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-wrap: nowrap;
  height: 125px;

  > .hide-scrollbar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;

    > div {
      box-sizing: border-box;
      display: flex;
      flex-wrap: nowrap;
      overflow: auto;
      width: 100%;
      padding-bottom: 2rem;

      > .category {
        display: flex;
        flex-flow: column nowrap;
        justify-content: flex-start;

        > .head {
          flex: 1;
          padding-bottom: 0.6rem;
          font-size: 0.8rem;
          color: ${textSecondary};
        }
        > .items {
          flex: 1;
          display: flex;
          flex-flow: row nowrap;
          justify-content: flex-start;
        }
      }
    }
  }
`;

export const ItemWrapper = styled.div<any>`
  width: 110px;
  height: 80px;
  border-radius: 0.7rem;
  background: ${(props) =>
    props.active ? 'rgba(211, 48, 121, 0.85)' : 'none'};
  display: flex;
  flex-flow: column nowrap;
  margin-right: 1rem;
  position: relative;
  border: 1px solid ${borderPrimary};

  &:last-child {
    margin-right: 0;
  }

  section {
    display: flex;
    flex-flow: row wrap;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    width: 100%;

    &:first-child {
      flex-grow: 1;
      flex-basis: 70%;
      justify-content: flex-start;
      align-items: flex-end;
      padding-bottom: 0.6rem;

      .icon {
        display: flex;
        flex-flow: column wrap;
        justify-content: center;
        align-items: center;
        padding: 0 0.5rem;
      }
    }

    &:last-child {
      justify-content: flex-start;
      padding-top: 0.2rem;
      flex-basis: 30%;
      min-height: 40px;
      display: flex;
      flex-flow: column wrap;
      justify-content: flex-start;

      p {
        color: ${(props) => (props.active ? 'white' : textSecondary)};
        font-size: 0.85rem;
        margin: 0;
        text-align: left;
        padding-top: 0.15rem;
        line-height: 0.9rem;
      }
    }

    .active {
      position: absolute;
      right: 6px;
      top: 4px;
      width: 20px;
      height: 20px;
      z-index: 2;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }
  }
`;

export default Wrapper;
