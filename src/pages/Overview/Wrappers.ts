// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import {
  borderPrimary,
  textPrimary,
  textSecondary,
  networkColor,
  backgroundGradient,
} from 'theme';
import { SMALLEST_FONT_SIZE_WIDTH } from 'consts';

export const SectionWrapper = styled.div`
  padding: 0 1.25rem 0rem 1.25rem;
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-flow: column wrap;

  .account {
    box-sizing: border-box;
    width: 100%;
    height: 27px;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    padding: 0;
    margin-top: 1.25rem;

    button {
      color: ${textPrimary};
    }

    .icon {
      position: relative;
      top: 0.1rem;
    }
    .title {
      box-sizing: border-box;
      margin: 0;
      padding: 0 0.5rem;
      flex-grow: 1;
      overflow: hidden;
    }
    h4 {
      margin: 0;
      > .sep {
        border-right: 1px solid ${borderPrimary};
        margin: 0 0.7rem;
        width: 1px;
        height: 1.25rem;
      }
      > .addr {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        flex: 1;
        opacity: 0.75;
      }
    }

    > *:last-child {
      flex-grow: 1;
      display: flex;
      flex-flow: row-reverse wrap;

      > .copy {
        color: ${textSecondary};
        opacity: 0.5;
        cursor: pointer;
        transition: opacity 0.1s;
        &:hover {
          opacity: 0.8;
        }
      }
    }
  }
`;

export const Separator = styled.div`
  border-bottom: 1px solid ${borderPrimary};
  margin-top: 0.8rem;
  margin-bottom: 0.2rem;
  width: 100%;
  height: 1px;
`;

export const ReturnsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row wrap;

  h4 {
    color: ${textSecondary};
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    margin-bottom: 0;

    .assistant-icon {
      margin-left: 0.4rem;
    }
  }

  > section {
    display: flex;
    flex-flow: column wrap;
    justify-content: center;
    padding: 0 0.5rem;

    &:first-child {
      flex-basis: 33%;
      padding-left: 0;
    }
    &:last-child {
      flex-basis: 67%;
      padding-right: 0;
    }
    .items {
      box-sizing: border-box;
      flex-grow: 1;
      display: flex;
      flex-flow: row wrap;
      margin-top: 0.7rem;

      > div {
        box-sizing: border-box;
        flex-grow: 1;
        padding-right: 1rem;

        &:last-child {
          padding-right: 0;
        }

        > .inner {
          background: ${backgroundGradient};
          border-radius: 0.7rem;
          width: 100%;
          padding: 0.75rem 0.9rem;
          display: flex;
          flex-flow: row nowrap;

          h2 {
            color: ${networkColor};
            margin-top: 0rem;
            margin-bottom: 0;
          }
          h5 {
            color: ${textSecondary};
            margin-top: 0.45rem;
            margin-bottom: 0;
          }
          display: flex;
          flex-flow: column wrap;
        }
      }
    }
  }
`;

export const ReserveWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  margin-top: 1.5rem;
  @media (max-width: ${SMALLEST_FONT_SIZE_WIDTH}px) {
    margin-top: 4.5rem;
  }

  > h4 {
    margin-top: 0.75rem;
    @media (max-width: ${SMALLEST_FONT_SIZE_WIDTH}px) {
      margin-top: 0.75rem;
    }
  }

  > .inner {
    display: flex;
    flex-flow: row wrap;
    margin-top: 0.25rem;
    @media (max-width: ${SMALLEST_FONT_SIZE_WIDTH}px) {
      margin-top: 0.5rem;
    }

    > section {
      display: flex;
      flex-flow: column wrap;
      justify-content: center;
      padding: 0 0.5rem;

      &:first-child {
        flex-basis: 30%;
        padding-left: 0;
        max-width: 9rem;
        .assistant-icon {
          margin-left: 0.5rem;
        }
      }
      &:last-child {
        border-radius: 0.5rem;
        flex-basis: 70%;
        padding-right: 0;
        flex-grow: 1;
        opacity: 0.5;
        transition: opacity 0.15s;
        &:hover {
          opacity: 1;
        }
      }
      .items {
        box-sizing: border-box;
        flex-grow: 1;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        margin-top: 0.4rem;

        > div {
          display: flex;
          flex-flow: column wrap;
          justify-content: center;
          height: 100%;
          box-sizing: border-box;
          padding: 0 0.75rem;
          flex: 1 1 100%;

          &.main {
            border-right: 1px solid ${borderPrimary};
            padding-right: 1rem;
            margin-right: 1rem;
          }
          &.sep {
            flex: 0;
            justify-content: center;
          }

          h2,
          h3 {
            color: ${textSecondary};
            margin-top: 0rem;
            margin-bottom: 0;
            &.center {
              justify-content: center;
            }
          }
        }
        h4,
        h5 {
          color: ${textSecondary};
          margin-top: 0.25rem;
          margin-bottom: 0;
          &.center {
            text-align: center;
          }
          &.sec {
            color: ${textSecondary};
          }
        }
        h4 {
          margin-top: 0;
        }
      }
    }
  }
`;
