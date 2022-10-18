// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { networkColor, textSecondary } from 'theme';

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  align-items: center;

  > section {
    color: ${textSecondary};
    display: flex;
    flex-flow: row wrap;
    align-items: center;
  }

  > section:last-child {
    flex: 1;
    justify-content: flex-end;

    .progress {
      color: ${textSecondary};
      opacity: 0.5;
    }

    .complete {
      margin: 0;
      color: ${networkColor};
    }

    span {
      margin-right: 1rem;
    }
  }

  h2 {
    margin: 0;
    padding: 0.3rem 0;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    align-items: center;

    .help-icon {
      margin-left: 0.6rem;
    }
  }
`;
