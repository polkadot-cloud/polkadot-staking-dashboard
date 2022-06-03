// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { textSecondary, borderPrimary, primary } from 'theme';

export const Wrapper = styled.div`
  box-sizing: border-box;
  padding: 0 0.5rem;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-wrap: nowrap;
  height: 60px;
  margin: 1rem 0;

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
      padding-bottom: 3rem;

      > .category {
        display: flex;
        flex-flow: column nowrap;
        justify-content: flex-start;

        > .head {
          flex: 1;
          padding-bottom: 0.5rem;
          padding-left: 0.5rem;
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
  border: 1px solid ${(props) => (props.active ? primary : borderPrimary)};
  border-radius: 0.7rem;
  display: flex;
  flex-flow: row nowrap;
  position: relative;
  padding: 0.6rem 0.85rem;
  margin-right: 1rem;
  align-items: center;

  &:last-child {
    margin-right: 0;
  }
  .icon {
    color: ${(props) => (props.active ? primary : textSecondary)};
    display: flex;
    flex-flow: column wrap;
    justify-content: center;
    align-items: center;
    margin-right: 0.75rem;
  }
  p {
    color: ${(props) => (props.active ? primary : textSecondary)};
    font-size: 0.9rem;
    margin: 0;
    text-align: left;
    padding-top: 0.15rem;
    line-height: 0.95rem;
  }
`;

export default Wrapper;
