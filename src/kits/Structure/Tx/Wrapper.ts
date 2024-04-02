// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  &.margin {
    margin-top: 1rem;
  }

  > .inner {
    background: var(--background-modal-footer);
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 1rem;

    &.canvas {
      background: var(--background-canvas-card);
    }

    &.card {
      border-radius: 0.5rem;
    }

    > section {
      width: 100%;

      > .inner {
        display: flex;
        flex-direction: row;
        align-items: center;

        > div {
          display: flex;

          &:first-child {
            flex-direction: column;
            justify-content: center;
            flex-grow: 1;

            p {
              color: var(--text-color-secondary);
              display: flex;
              align-items: center;
              font-size: 1rem;
              margin: 0.1rem 0;
              padding-left: 0.5rem;

              &.prompt {
                color: var(--accent-color-primary);
                font-size: 1.05rem;
                align-items: flex-start;

                .icon {
                  margin-top: 0.16rem;
                  margin-right: 0.5rem;
                }
              }
            }
          }

          &:last-child {
            button {
              margin-left: 0.75rem;
            }
          }
        }

        &.warning {
          margin-top: 1rem;
          margin-bottom: 0.25rem;
          padding: 0.5rem 0;
        }

        &.msg {
          border-top: 1px solid var(--border-primary-color);
          padding: 0.5rem 0;
          margin-top: 0.25rem;
        }
      }
    }
  }
`;

export const SignerWrapper = styled.p`
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  padding-bottom: 0.5rem;
  margin: 0;

  .badge {
    border: 1px solid var(--border-secondary-color);
    border-radius: 0.45rem;
    padding: 0.2rem 0.5rem;
    margin-right: 0.75rem;

    > svg {
      margin-right: 0.5rem;
    }
  }

  .not-enough {
    margin-left: 0.5rem;
  }

  .danger {
    color: var(--status-danger-color);
  }

  > .icon {
    margin-right: 0.3rem;
  }
`;
