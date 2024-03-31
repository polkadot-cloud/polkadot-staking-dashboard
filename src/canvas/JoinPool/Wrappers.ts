// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const JoinPoolInterfaceWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  > .header {
    display: flex;
    margin-bottom: 2rem;
  }

  > .content {
    display: flex;
    flex: 1;

    > div {
      display: flex;

      &:first-child {
        flex-grow: 1;
      }

      &:last-child {
        min-width: 450px;
      }
    }
  }
`;

export const TitleWrapper = styled.div`
  border-bottom: 1px solid var(--border-secondary-color);
  display: flex;
  flex-direction: column;
  margin: 2.25rem 0 0.75rem 0;
  padding-bottom: 0.2rem;
  width: 100%;

  > .inner {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
    flex: 1;

    > div {
      display: flex;

      &:nth-child(2) {
        flex-grow: 1;
        padding-left: 1rem;
        display: flex;
        flex-direction: column;

        > h1 {
          margin: 0;
        }

        > .labels {
          display: flex;
          margin-top: 0.65rem;

          > h3 {
            color: var(--text-color-secondary);
            font-family: Inter, sans-serif;
            margin: 0;

            > svg {
              margin: 0 0 0 0.2rem;
            }
          }
        }
      }
    }
  }
`;

export const JoinFormWrapper = styled.div`
  background: var(--background-canvas-card);
  border: 0.75px solid var(--border-primary-color);
  box-shadow: var(--card-shadow);
  border-radius: 1.5rem;
  padding: 1.25rem;
  margin-top: 0.75rem;
  width: 100%;

  h4 {
    display: flex;
    align-items: center;
    &.note {
      color: var(--text-color-secondary);
      font-family: Inter, sans-serif;
    }
  }

  > h2 {
    color: var(--text-color-secondary);
    margin: 0.25rem 0;
  }

  > h4 {
    margin: 1.5rem 0 0.5rem 0;
    color: var(--text-color-tertiary);

    &.underline {
      border-bottom: 1px solid var(--border-primary-color);
      padding-bottom: 0.5rem;
      margin: 2rem 0 1rem 0;
    }
  }

  > .input {
    border-bottom: 1px solid var(--border-primary-color);
    padding: 0 0.25rem;
    display: flex;
    align-items: flex-end;
    padding-bottom: 1.25rem;

    > div {
      &:first-child {
        flex-grow: 1;
        display: flex;
        align-items: flex-end;

        > h2 {
          font-size: 2rem;
        }
      }
    }
  }

  > .available {
    margin-top: 0.5rem;
    margin-bottom: 1.5rem;
    display: flex;
  }

  > .submit {
    margin-top: 2.5rem;
  }
`;

export const NominationsWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const HeadingWrapper = styled.div`
  margin: 0.75rem 0.5rem 0.9rem 0.5rem;

  > h3 {
    color: var(--text-color-primary);
    font-family: Inter, sans-serif;
    margin: 0;
  }
`;
