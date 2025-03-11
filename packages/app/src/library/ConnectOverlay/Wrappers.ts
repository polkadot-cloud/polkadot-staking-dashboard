// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import styled from 'styled-components'

export const ItemWrapper = styled.div`
  border-bottom: 1px solid var(--border-primary-color);
  flex: 1;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  height: 5.4rem;

  &.asButton {
    &:hover {
      background: var(--button-popover-tab-background);
      cursor: pointer;
    }
  }

  &.last {
    border-bottom: none;
    margin-bottom: 0;
  }

  > div {
    display: flex;
    align-items: center;

    &:first-child {
      flex: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 4.25rem;
      max-width: 4.25rem;

      > .icon {
        background: var(--button-secondary-background);
        border-radius: 50%;
        width: 2.75rem;
        height: 2.75rem;
        display: flex;
        align-items: center;
        justify-content: center;

        > svg {
          width: 62%;
          height: 62%;
        }
      }
    }

    &:last-child {
      flex-grow: 1;
      display: flex;
      padding-right: 0.75rem;
      > div {
        &:first-child {
          flex-grow: 1;
        }
      }
    }
  }
`

export const ChainSearchInputWrapper = styled.div`
  border: 1px solid var(--border-primary-color);
  background-color: var(--background-primary);
  color: var(--text-color-tertiary);
  border-radius: 0.4rem;
  flex: 1;
  display: flex;
  align-items: center;
  padding: 0 0.5rem;
  margin-bottom: 0.5rem;

  > .icon {
    margin-right: 0.15rem;
  }

  > .chainIcon {
    width: 0.75rem;
    height: 0.75rem;
    margin-right: 0.2rem;
    position: relative;

    > svg {
      fill: var(--text-color-secondary);
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }

  > input {
    color: var(--text-color-secondary);
    border: none;
    border-radius: 0.4rem;
    font-family: InterSemiBold, sans-serif;
    font-size: 0.75rem;
    padding: 0.5rem 0 0.5rem 0.2rem;
    flex: 1;
  }

  button {
    color: var(--text-color-tertiary);
  }
`

export const ImportButtonWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;

  > button {
    color: var(--accent-color-secondary);
    font-family: InterSemiBold, sans-serif;
    font-size: 0.75rem;
    padding: 0 0.6rem;

    &:disabled {
      cursor: default;
      opacity: 0.5;
    }

    > svg {
      margin-right: 0.2rem;
    }
  }
`

export const SubHeadingWrapper = styled.div`
  border-bottom: 1px solid var(--border-primary-color);
  padding-bottom: 0.6rem;
  flex: 1;
  display: flex;
  align-items: flex-end;
  margin: 0.8rem 0 0.3rem 0;

  &.noBorder {
    border-bottom: none;
    padding-bottom: 0;
  }

  > h5 {
    font-size: 0.75rem;
    line-height: 0.75rem;
    padding-left: 0.25rem;
  }
`

export const ChainResultsWrapper = styled.div`
  flex: 1;

  > .results {
    > button {
      &:first-child {
        border-color: transparent;
      }
      &:last-child {
        border-bottom: 1px solid var(--border-primary-color);
      }
    }
  }
`

export const ChainResultWrapper = styled.button`
  border-top: 1px solid var(--border-primary-color);
  color: var(--text-color-secondary);
  font-family: InterSemiBold, sans-serif;
  font-size: 0.7rem;
  width: 100%;
  display: flex;
  padding: 0.6rem 0.5rem;

  &:hover {
    background: var(--button-hover-background);
    border-radius: 0.4rem;
    border-color: transparent;
  }
`

export const ImportQRWrapper = styled.div`
  border: 1px solid var(--border-primary-color);
  border-radius: 0.4rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 0.25rem;

  > .qrRegion {
    border: 1px solid var(--border-secondary-color);
    background-color: var(--background-invert);
    border-radius: 0.35rem;
    overflow: hidden;
    width: 250px;
    height: 188px;
    margin: 0.6rem 0 0.4rem 0;
  }

  > h4 {
    margin-bottom: 0.3rem;
  }
`
