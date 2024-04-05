// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const CanvasFullScreenWrapper = styled.div`
  padding-top: 3rem;
  min-height: calc(100vh - 12rem);
  padding-bottom: 2rem;
  width: 100%;

  > .head {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  > h1 {
    margin-top: 1.5rem;
    margin-bottom: 1.25rem;
  }
`;

export const CanvasTitleWrapper = styled.div`
  border-bottom: 1px solid var(--border-secondary-color);
  flex: 1;
  display: flex;
  flex-direction: column;
  margin: 2rem 0 1.55rem 0;
  padding-bottom: 0.1rem;

  > .inner {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
    flex: 1;

    &.standalone {
      padding-bottom: 0.5rem;
    }

    > div {
      display: flex;
      flex: 1;

      &:nth-child(1) {
        max-width: 4rem;

        &.empty {
          max-width: 0px;
        }
      }

      &:nth-child(2) {
        padding-left: 1rem;
        flex-direction: column;

        &.standalone {
          padding-left: 0;
        }

        > .title {
          position: relative;
          padding-top: 2rem;
          flex: 1;

          h1 {
            position: absolute;
            top: 0;
            left: 0;
            margin: 0;
            line-height: 2.2rem;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            width: 100%;
          }
        }

        > .labels {
          display: flex;
          margin-top: 1.1rem;

          > h3 {
            color: var(--text-color-secondary);
            font-family: Inter, sans-serif;
            margin: 0;

            > svg {
              margin: 0 0 0 0.2rem;
            }

            > span {
              border: 1px solid var(--border-secondary-color);
              border-radius: 0.5rem;
              padding: 0.4rem 0.6rem;
              margin-left: 1rem;
              font-size: 1.1rem;

              &.blocked {
                color: var(--accent-color-secondary);
                border-color: var(--accent-color-secondary);
              }

              &.destroying {
                color: var(--status-danger-color);
                border-color: var(--status-danger-color);
              }
            }
          }
        }
      }
    }
  }
`;

export const CanvasSubmitTxFooter = styled.div`
  border-radius: 1rem;
  overflow: hidden;
  margin-bottom: 2rem;
  width: 100%;
`;
