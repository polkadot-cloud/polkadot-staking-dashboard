// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { textSecondary, borderPrimary } from '../../theme';

export const Wrapper = styled.div`
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;

  h3 {
    margin-bottom: 0;
  }
`;

export const StakingAccount = styled.div<any>`
  margin-bottom: ${props => props.last === true ? `none` : '1rem'};
  display: flex;
  flex-flow: row wrap;
  h4 {
    color: ${textSecondary};
  }
`;

export const Section = styled.div`
  flex: 1;
  display: flex;
  padding-right: 0.5rem;

  &:last-child {
      padding-right: 0;
    }

  > div {
    flex: 1;
    background: white;
    border-radius: 0.75rem;
    margin-right: 1rem;
    padding: 0 1rem;
  }
`;

export const Separator = styled.div`
  width: 100%;
  border-bottom: 1px solid ${borderPrimary};
  margin: 1.5rem 0;
`;

export default Wrapper;