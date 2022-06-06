// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { primary, textSecondary } from 'theme';

export const ListWrapper = styled.div`
  display: flex;
  flex-flow: column wrap;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  width: 100%;

  > div {
    width: 100%;
  }
`;

export const FooterWrapper = styled.div`
  position: relative;
  bottom: 0px;
  left: 0px;
  margin: 1rem 0;
  width: 100%;
  display: flex;
  flex-flow: row wrap;

  button {
    font-size: 1.2rem;
    color: ${primary};

    &:disabled {
      opacity: 0.5;
      color: ${textSecondary};
    }
  }
`;
export default ListWrapper;
