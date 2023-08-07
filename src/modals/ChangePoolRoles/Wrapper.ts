// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-flow: column wrap;
  margin-top: 1rem;
  width: 100%;
`;

export const RoleChangeWrapper = styled.div`
  position: relative;
  width: 100%;
  height: auto;
  overflow: hidden;

  .label {
    color: var(--text-color-secondary);
    margin: 0.25rem 0 0.75rem 0;
  }
  .role-change {
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

  .input-wrap {
    border-bottom: 1px solid var(--border-primary-color);
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    padding: 0.25rem 0 0 0;
    margin: 0.25rem 0.7rem 0 0.7rem;
    flex: 1;

    &.selected {
      border: 1px solid var(--border-primary-color);
      border-radius: 1rem;
      margin: 0;
      padding: 0.1rem 0.75rem;
    }
  }
  .input {
    border: none;
    padding-left: 0.75rem;
    flex: 1;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
`;
