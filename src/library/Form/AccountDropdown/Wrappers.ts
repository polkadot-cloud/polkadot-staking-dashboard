// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';

export const StyledDownshift = styled.div`
  position: relative;
  width: 100%;
  height: auto;
  overflow: hidden;

  .label {
    margin: 0.25rem 0 0.75rem 0;
  }
  .current {
    flex: 1;
    display: flex;
    align-items: center;
    margin-bottom: 1rem;

    > span {
      color: var(--text-color-secondary);
      margin: 0 0.75rem;
      opacity: 0.5;
    }
  }

  /* input element of dropdown */
  .input-wrap {
    border-bottom: 1px solid var(--border-primary-color);
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    padding: 0.25rem 0 0 0;
    margin: 0.25rem 0rem 0 0rem;
    flex: 1;

    &.selected {
      margin: 0;
      padding: 0.1rem 0.75rem;
    }
  }

  /* input element of dropdown */
  .input {
    border: none;
    padding-left: 0.75rem;
    flex: 1;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
`;

export const StyledController = styled.button<any>`
  color: var(--text-color-primary);
  border: none;
  position: absolute;
  right: 0.5rem;
  top: 0.4rem;
  width: 2.2rem;
  height: 2.2rem;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
`;

/* dropdown box for vertical scroll */
export const StyledDropdown = styled.div<any>`
  border: 1px solid var(--border-primary-color);
  position: relative;
  margin: 0.5rem 0 0;
  border-radius: 0.75rem;
  z-index: 1;

  .items {
    width: 100%;
    height: ${(props) => (props.height ? props.height : 'auto')};
    overflow: auto;

    button {
      width: 100%;
      cursor: pointer;
      opacity: 1;
      padding: 0.5rem;
      margin: 0.25rem 0;
      border-radius: 0.75rem;
      display: flex;
      flex-flow: row wrap;
      align-items: center;
      border: 2px solid;
      border-color: var(--transparent-color);

      &.inactive {
        opacity: 0.5;
        cursor: default;
      }

      &.selected {
        border-color: var(--network-color-primary);
      }

      .icon {
        margin-right: 0.5rem;
      }

      span {
        color: var(--text-color-secondary);
        border: 1px solid var(--border-secondary-color);
        border-radius: 0.5rem;
        padding: 0.2rem 0.5rem;
        font-size: 0.9rem;
        margin-right: 0.5rem;
      }
      p {
        color: var(--text-color-primary);
        font-size: 1rem;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        flex: 1;
        text-align: left;
      }
    }
  }
`;
