// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  align-items: center;

  > section {
    color: var(--text-color-secondary);
    display: flex;
    flex-flow: row wrap;
    align-items: center;
  }

  > section:last-child {
    flex: 1;
    justify-content: flex-end;

    .progress {
      color: var(--text-color-secondary);
      opacity: 0.5;
    }

    .complete {
      margin: 0;
      color: var(--accent-color-primary);
    }

    span {
      margin-right: 1rem;
    }
  }

  h2 {
    padding: 0.3rem 0;
    display: flex;
    flex-flow: row wrap;
    align-items: center;
  }
`;
