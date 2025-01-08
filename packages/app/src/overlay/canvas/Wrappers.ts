// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components'

export const CanvasTitleWrapper = styled.div`
  border-bottom: 1px solid var(--border-secondary-color);
  flex: 1;
  display: flex;
  flex-direction: column;
  margin: 2rem 0 1.55rem 0;
  padding-bottom: 0.1rem;

  &.padding {
    padding-bottom: 1rem;
  }

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

          &.padding {
            padding-bottom: 0.75rem;
          }

          > h1 {
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
      }
    }
  }
`

export const CanvasTitleOnlyWrapper = styled.div`
  border-bottom: 1px solid var(--border-secondary-color);
  flex: 1;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  margin-bottom: 1rem;

  flex: 1;
  display: flex;

  > h1 {
    margin: 0;
    line-height: 2.2rem;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    width: 100%;
    margin: 0.75rem 0;
  }

  > h3 {
    padding-bottom: 1rem;
    display: flex;
    align-items: center;
    > button {
      margin-left: 0.75rem;
    }
  }
`
