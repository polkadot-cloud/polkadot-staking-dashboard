// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { backgroundToggle, borderPrimary, textPrimary } from 'theme';

export const StyledDownshift = styled.div<any>`
  position: relative;
  width: 100%;
  height: ${(props) => (props.height ? props.height : 'auto')};
  overflow: hidden;

  /* title of dropdown */
  .label {
    margin: 1rem 0;
    display: block;
  }

  /* input element of dropdown */
  .input-wrap {
    border: 1px solid ${borderPrimary};
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    border-radius: 1rem;
    padding: 0.1rem 0.75rem;
    margin: 0.25rem 0;
  }

  .input {
    border: none;
    padding-left: 0.75rem;
    flex-grow: 1;
  }
`;

export const StyledController = styled.button<any>`
  color: ${textPrimary};
  position: absolute;
  right: 0.5rem;
  top: 0.6rem;
  width: 2.2rem;
  height: 2.2rem;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
`;

/* dropdown box for horizontal scroll */
export const StyledSelect = styled.div`
  border: 1px solid ${borderPrimary};
  position: relative;
  margin: 0.75rem 0 0;
  width: 100%;
  border-radius: 1rem;
  z-index: 1;
  height: 170px;
  padding: 0.25rem;
  overflow: auto;
  display: flex;
  flex-flow: row wrap;
  flex: 1;
  border-radius: 1rem;

  .wrapper {
    position: relative;
    min-width: 240px;
    height: 125px;
    flex: 1 1 20%;
    max-width: 20%;
    padding: 0.35rem;

    .item {
      background: ${backgroundToggle};
      position: relative;
      width: 100%;
      height: 100%;
      padding: 0.65rem 1rem;
      cursor: pointer;
      border-radius: 1rem;
      display: flex;
      flex-flow: column wrap;
      justify-content: center;
      align-items: flex-start;
      flex-grow: 1;
      overflow: hidden;

      > .title {
        display: flex;
        flex-flow: row wrap;
        max-width: 100%;

        h3 {
          display: inline-block;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
      }

      &:first-child {
        margin-left: 0rem;
      }
      &:last-child {
        margin-right: 0rem;
      }
      p {
        color: ${textPrimary};
        margin: 0.15rem 0 0;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        flex: 1;
      }
      .icon {
        margin-bottom: 0.7rem;
      }
    }
  }
`;
