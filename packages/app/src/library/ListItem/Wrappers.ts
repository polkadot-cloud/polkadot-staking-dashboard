// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components'

export const Wrapper = styled.div`
  --height-top-row: 3.25rem;
  --height-bottom-row: 5rem;

  &.member {
    --height-bottom-row: 2.75rem;
  }
  &.pool {
    --height-bottom-row: 3.25rem;
  }

  --height-total: calc(var(--height-top-row) + var(--height-bottom-row));

  height: var(--height-total);
  display: flex;
  flex-flow: row wrap;
  position: relative;
  margin: 0.5rem;
  width: 100%;

  > .inner {
    background: var(--background-list-item);
    &.modal {
      background: var(--background-modal-card);
    }
    &.canvas {
      background: var(--background-canvas-card);
    }
    &.modal,
    &.canvas {
      box-shadow: none;
      border: none;
    }

    border-radius: 1rem;
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    overflow: hidden;
    position: absolute;
    padding: 0;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;

    .row {
      flex: 1 0 100%;
      display: flex;
      align-items: center;
      padding: 0 0.5rem;

      &.top {
        height: var(--height-top-row);
      }
      &.bottom {
        height: var(--height-bottom-row);

        &.pools {
          align-items: flex-start;
        }

        &.lg {
          display: flex;
          align-items: center;

          > div {
            &:first-child {
              flex-grow: 1;
              padding: 0 0.25rem;
            }
            &:last-child {
              flex-shrink: 1;
              display: flex;
              flex-direction: column;
              align-items: flex-end;
            }
          }
        }
      }
    }
  }
`

export const Labels = styled.div`
  display: flex;
  justify-content: flex-end;
  font-size: 0.85rem;
  align-items: center;
  overflow: hidden;
  flex-grow: 1;
  padding: 0 0 0 0.25rem;
  height: inherit;
`

export const ValidatorStatusWrapper = styled.div<{
  $status: string
  $noMargin?: boolean
}>`
  margin-right: ${(props) => (props.$noMargin ? '0' : '0.35rem')};
  padding: 0 0.5rem;

  h5 {
    color: ${(props) =>
      props.$status === 'active'
        ? 'var(--status-success-color)'
        : 'var(--text-color-secondary)'};
    opacity: ${(props) => (props.$status === 'active' ? 0.8 : 0.5)};
    display: flex;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

export const PoolStatusWrapper = styled.div<{
  $status: string
}>`
  h4,
  h5 {
    display: flex;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  h4 {
    color: var(--text-color-tertiary);
    font-size: 1rem;

    padding-top: ${(props) =>
      props.$status === 'active' ? '0.15rem' : '0.25rem'};

    > span {
      color: ${(props) =>
        props.$status === 'active'
          ? 'var(--status-success-color)'
          : 'var(--text-color-tertiary)'};

      border: 0.75px solid
        ${(props) =>
          props.$status === 'active'
            ? 'var(--status-success-color)'
            : 'transparent'};

      padding: ${(props) => (props.$status === 'active' ? '0 0.5rem' : '0')};
      border-radius: 0.3rem;
      opacity: ${(props) => (props.$status === 'active' ? 1 : 0.6)};
    }
  }
`

export const TooltipTrigger = styled.div`
  z-index: 1;
  width: 130%;
  height: 130%;
  position: absolute;
  top: -10%;
  left: -10%;

  &.pointer {
    cursor: pointer;
  }
`
