// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { motion } from 'framer-motion';
import styled from 'styled-components';
import { SmallFontSizeMaxWidth } from 'consts';

export const Wrapper = styled.div`
  --height-top-row: 3.25rem;
  --height-bottom-row: 5rem;

  &.member {
    --height-bottom-row: 2.75rem;
  }
  &.pool-join {
    --height-bottom-row: 7.5rem;
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
`;

export const Labels = styled.div`
  display: flex;
  justify-content: flex-end;
  font-size: 0.85rem;
  align-items: center;
  overflow: hidden;
  flex-grow: 1;
  padding: 0 0 0 0.25rem;
  height: inherit;

  button {
    background: var(--shimmer-foreground);
    padding: 0 0.1rem;
    font-size: 1rem;
    border-radius: 50%;
    width: 1.9rem;
    height: 1.9rem;

    @media (min-width: ${SmallFontSizeMaxWidth}px) {
      padding: 0 0.2rem;
    }
    color: var(--text-color-secondary);
    &:hover {
      opacity: 0.75;
    }
    &.active {
      color: var(--accent-color-primary);
    }
    &:disabled {
      opacity: var(--opacity-disabled);
    }
  }

  &.canvas button {
    border: 1px solid var(--border-secondary-color);
    background: none;
  }

  .label {
    color: var(--text-color-secondary);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: inherit;

    @media (min-width: ${SmallFontSizeMaxWidth}px) {
      margin: 0 0.35rem;
      &.pool {
        margin: 0 0.45rem;
      }
    }

    &.button-with-text {
      margin-right: 0;

      button {
        color: var(--accent-color-secondary);
        font-family: InterSemiBold, sans-serif;
        font-size: 0.95rem;
        display: flex;
        flex-flow: row wrap;
        align-items: center;
        width: auto;
        height: auto;
        border-radius: 0.75rem;
        padding: 0.25rem 0.75rem;

        &:hover {
          opacity: 1;
        }
        > svg {
          margin-left: 0.3rem;
        }
      }
    }

    &.warning {
      color: #d2545d;
      display: flex;
      flex-flow: row wrap;
      align-items: center;
      padding-right: 0.35rem;
    }
  }
`;

export const OverSubscribedWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;

  .warning {
    margin-right: 0.25rem;
    @media (max-width: 500px) {
      display: none;
    }
  }
`;
export const IdentityWrapper = styled(motion.div)`
  display: flex;
  margin-right: 0.5rem;
  align-items: center;
  align-content: center;
  overflow: hidden;
  flex: 1 1 25%;
  position: relative;

  .inner {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    width: 100%;
    height: 3.25rem;
    padding: 0 0 0 0.2rem;
  }
  h4 {
    color: var(--text-color-secondary);
    font-family: InterSemiBold, sans-serif;
    position: absolute;
    top: 0;
    height: 3.25rem;
    line-height: 3.25rem;
    padding: 0 0 0 0.3rem;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 1rem;
    width: 100%;

    > span {
      color: var(--text-color-secondary);
      opacity: 0.75;
      font-size: 0.88rem;
      margin-left: 0.35rem;
      position: relative;
      top: -0.1rem;
    }
  }
`;

export const ValidatorStatusWrapper = styled.div<{
  $status: string;
  $noMargin?: boolean;
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
`;

export const SelectWrapper = styled.button`
  background: var(--background-input);
  margin: 0 0.75rem 0 0.25rem;
  overflow: hidden;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  border-radius: 0.25rem;
  width: 1.1rem;
  height: 1.1rem;
  padding: 0;
  * {
    cursor: pointer;
    width: 100%;
    padding: 0;
  }

  span {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  svg {
    color: var(--text-color-primary);
    width: 1rem;
    height: 1rem;
  }
  .select-checkbox {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
  }
`;

export const Separator = styled.div`
  border-bottom: 1px solid var(--border-primary-color);
  width: 100%;
  height: 1px;
  opacity: 0.7;
`;

export const MenuPosition = styled.div`
  position: absolute;
  top: -10px;
  right: 10px;
  width: 0;
  height: 0;
  opacity: 0;
`;

export const TooltipTrigger = styled.div`
  z-index: 1;
  width: 130%;
  height: 130%;
  position: absolute;
  top: -10%;
  left: -10%;

  &.as-button {
    cursor: pointer;
  }
`;

export const ValidatorPulseWrapper = styled.div`
  border: 1px solid var(--grid-color-primary);
  border-radius: 0.25rem;
  height: 3.2rem;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 13.5rem;
  position: relative;
  padding: 0.15rem 0;

  &.canvas {
    border: 1px solid var(--grid-color-secondary);
  }

  > svg {
    max-width: 100%;
    max-height: 100%;
  }

  > .preload {
    position: absolute;
    top: 0;
    left: 0;
    background: var(--shimmer-foreground);
    background-image: linear-gradient(
      to right,
      var(--shimmer-foreground) 0%,
      var(--shimmer-background) 20%,
      var(--shimmer-foreground) 40%,
      var(--shimmer-foreground) 100%
    );
    background-repeat: no-repeat;
    background-size: 500px 104px;
    animation-duration: 1.5s;
    opacity: 0.2;
    animation-fill-mode: forwards;
    animation-iteration-count: infinite;
    animation-name: shimmer;
    animation-timing-function: linear;
    z-index: 0;
    width: 100%;
    height: 100%;

    @keyframes shimmer {
      0% {
        background-position: -50% 0;
      }
      100% {
        background-position: 200% 0;
      }
    }
  }
`;
