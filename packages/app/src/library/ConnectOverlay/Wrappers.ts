// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { motion } from 'framer-motion'
import styled from 'styled-components'

export const Wrapper = styled(motion.div)`
  --connect-item-height: 3.25rem;
  padding: 0.75rem;

  > .scroll {
    box-shadow: var(--shadow-floating-menu);
    border: 1px solid var(--border-secondary-color);
    background: var(--background-default);
    border-radius: 0.4rem;
    overflow-y: scroll;
    overflow-x: hidden;
    position: relative;

    > .inner {
      display: flex;
      flex-flow: column wrap;
      padding: 0.7rem;
      width: 100%;

      .title {
        flex: 1;
        display: flex;

        > h3 {
          color: var(--text-color-tertiary);
          margin-bottom: 0.35rem;
          font-size: 0.75rem;

          > svg {
            margin-right: 0.4rem;
          }
        }

        > button {
          border: 1px solid var(--border-secondary-color);
          background-color: var(--background-default);
          color: var(--text-color-tertiary);
          font-family: InterSemiBold, sans-serif;
          font-size: 0.75rem;
          margin-left: auto;
          padding: 0.25rem 0.5rem;
          border-radius: 0.4rem;
          cursor: pointer;

          &:hover {
            background-color: var(--background-hover);
          }
        }
      }

      > h4 {
        font-family: InterSemiBold, sans-serif;
        margin: 0.75rem 0 0.4rem 0;
        overflow: hidden;

        &.hidden {
          margin: 0.75rem 0 0 0;
        }
      }

      > .motion {
        overflow: hidden;

        > .motion {
          overflow: hidden;
        }

        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
`

export const ItemWrapper = styled.div`
  background-color: var(--background-default);
  border: 1px solid var(--border-secondary-color);
  border-radius: 0.4rem;
  flex: 1;
  padding: 0 0.5rem;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  margin-bottom: 0.5rem;

  &.last {
    margin-bottom: 0;
  }

  > div {
    height: var(--connect-item-height);
    display: flex;
    align-items: center;

    &:first-child {
      height: var(--connect-item-height);
      flex: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 2rem;
      max-width: 2rem;
      height: 100%;

      .icon-web {
        width: 1.6rem;
        height: 1.6rem;
      }

      > .icon {
        width: 1.75rem;
        height: 1.75rem;
      }
    }

    &:last-child {
      flex-grow: 1;
      display: flex;
      padding-left: 0.5rem;

      > div {
        &:first-child {
          flex-grow: 1;

          > h4,
          > h5 {
            display: flex;
            align-items: center;
          }

          > h4 {
            font-family: InterBold, sans-serif;
            line-height: 0.85rem;
            margin-bottom: 0.25rem;

            &.connected {
              color: var(--text-color-primary);
            }

            > .badge {
              color: var(--text-color-secondary);
              border-radius: 0.25rem;
              font-size: 0.7rem;
              margin-left: 0.35rem;
            }
          }

          > h5 {
            color: var(--text-color-tertiary);
            font-family: InterSemiBold, sans-serif;

            > a {
              color: var(--text-color-tertiary);
              text-decoration: none;
              display: flex;
              align-items: center;

              > svg {
                margin-left: 0.15rem;
              }
            }
          }
        }
        &:last-child {
          padding-right: 0.25rem;

          > button {
            color: var(--accent-color-secondary);
            font-family: InterSemiBold, sans-serif;
            font-size: 0.75rem;

            svg {
              margin-right: 0.2rem;
            }

            &:disabled {
              color: var(--text-color-tertiary);
              cursor: default;
            }
          }
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
