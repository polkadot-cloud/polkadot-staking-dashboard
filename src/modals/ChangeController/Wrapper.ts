// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { textSecondary } from '../../theme';

export const Wrapper = styled.div`
  display: flex;
  flex-flow: column wrap;
  align-items: center;
  justify-content: flex-start;
  padding: 1rem;

  h3 {
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    margin-top: 0.25rem;
    color: ${textSecondary};
    flex: 1;
    > svg {
      margin-right: 0.75rem;
    }
  }

  .form {
    width: 100%;
    height: 250px;
    overflow: hidden;
  }

  .submit {
    padding: 0.5rem 0.75rem;
    border-radius: 0.7rem;
    font-size: 1rem;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    background: #fff;
    transition: background 0.15s;
    color: rgba(211, 48, 121, 0.85);
    border: 1px solid rgba(211, 48, 121, 0.85);

    &:hover {
      background: #fafafa;
    }

    svg {
      margin-right: 0.5rem;
    }
  }

  .foot {
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-end;
    width: 100%;
    flex: 1;
    margin-top: 1rem;
  }
`;

export default Wrapper;