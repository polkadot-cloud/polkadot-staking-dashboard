/* @license Copyright 2024 @polkadot-cloud/library authors & contributors
SPDX-License-Identifier: GPL-3.0-only */

import styled from 'styled-components';

export const PageHeadingWrapper = styled.div`
  border-bottom: 1px solid var(--border-primary-color);
  display: flex;
  align-items: center;
  flex-flow: row wrap;
  padding-bottom: 0.75rem;
  padding-top: 0.75rem;
  margin-bottom: 0.25rem;
  width: 100%;

  > span {
    margin-right: 1rem;
  }

  .right {
    flex: 1 1 0%;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-end;

    button {
      margin: 0 0 0 1rem;
    }
  }
`;
