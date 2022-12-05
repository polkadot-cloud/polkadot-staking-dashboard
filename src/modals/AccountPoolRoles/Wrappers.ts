// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import {
  backgroundSecondary,
  backgroundToggle,
  borderPrimary,
  buttonPrimaryBackground,
  textPrimary,
  textSecondary,
  textSuccess,
} from 'theme';

export const ContentWrapper = styled.div`
  width: 100%;

  > h4 {
    color: ${textSecondary};
    margin: 0.75rem 0;
    padding-bottom: 0.5rem;
    width: 100%;
    border-bottom: 1px solid ${borderPrimary};
  }

  .items {
    position: relative;
    border-bottom: none;
    width: auto;
    border-radius: 0.75rem;
    overflow: hidden;
    overflow-y: auto;
    z-index: 1;
    width: 100%;
    margin: 1rem 0 1.5rem 0;

    h4 {
      margin: 0.2rem 0;
    }
    h2 {
      margin: 0.75rem 0;
    }
  }
`;

export const StyledButton = styled.button`
  background: ${buttonPrimaryBackground};
  padding: 1rem 1.2rem;
  cursor: pointer;
  margin-bottom: 1rem;
  border-radius: 0.2rem;
  display: inline-flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: center;
  width: 100%;

  &:last-child {
    margin-bottom: 0;
  }

  h3 {
    margin: 0 0 0 0.25rem;
  }

  h4 {
    margin: 0;
    &.selected {
      color: ${textSuccess};
      margin-left: 0.75rem;
    }
  }

  > *:last-child {
    flex: 1;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-end;
  }
  &:hover {
    background: ${backgroundToggle};
  }
  .icon {
    margin-right: 0.75rem;
  }
  .details {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    > h4 {
      margin-left: 1rem;
      span {
        margin-right: 0.5rem;
        border: 1px solid ${borderPrimary};
        background: ${backgroundSecondary};
        padding: 0.25rem 0.75rem;
        border-radius: 0.2rem;
      }
    }
  }

  svg {
    color: ${textSecondary};
    fill: ${textSecondary};
  }
  p {
    color: ${textPrimary};
    font-size: 1rem;
  }
`;
