// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { backgroundWarning, borderWarning, textWarning } from 'theme';

export const Wrapper = styled.div`
  background: ${backgroundWarning};
  border: 1px solid ${borderWarning};
  margin: 0.5rem 0;
  padding: 0.6rem 0.75rem;
  border-radius: 0.75rem;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  width: 100%;

  > h4 {
    color: ${textWarning};
    margin: 0;

    .icon {
      color: ${textWarning};
      margin-right: 0.6rem;
    }
  }
`;
