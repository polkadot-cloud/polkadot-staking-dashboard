// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import {
  borderPrimary,
  textPrimary,
  backgroundDropdown,
  textSecondary,
} from 'theme';

export const Wrapper = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-flow: column wrap;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 1rem 0;
`;

export const RoleChangeWrapper = styled.div`
  box-sizing: border-box;
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
      margin: 0 0.75rem;
      color: ${textSecondary};
      opacity: 0.5;
    }
  }

  /* input element of dropdown */
  .input-wrap {
    border-bottom: 1px solid ${borderPrimary};
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    box-sizing: border-box;
    padding: 0.25rem 0 0 0;
    margin: 0.25rem 0.7rem 0 0.7rem;
    flex: 1;

    &.selected {
      border: 1px solid ${borderPrimary};
      border-radius: 1rem;
      margin: 0;
      padding: 0.1rem 0.75rem;
    }
  }

  /* input element of dropdown */
  .input {
    border: none;
    box-sizing: border-box;
    padding-left: 0.75rem;
    flex: 1;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
`;

export default Wrapper;
