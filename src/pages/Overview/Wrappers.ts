// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import {
  textPrimary,
  textSecondary,
  borderPrimary,
  buttonSecondaryBackground,
} from 'theme';
import { SMALL_FONT_SIZE_MAX_WIDTH, MEDIUM_FONT_SiZE_MAX_WIDTH } from 'consts';

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

export const ReserveWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  margin-top: 5rem;
  @media (min-width: ${SMALL_FONT_SIZE_MAX_WIDTH + 1}px) {
    margin-top: 2.25rem;
  }
  @media (min-width: ${MEDIUM_FONT_SiZE_MAX_WIDTH + 1}px) {
    margin-top: 2rem;
  }
  > h4 {
    margin-top: 0.75rem;
    @media (min-width: ${SMALL_FONT_SIZE_MAX_WIDTH + 1}px) {
      margin-top: 0.9rem;
    }
  }
  > .inner {
    display: flex;
    flex-flow: row wrap;
    margin: 0;

    > section {
      display: flex;
      flex-flow: row wrap;
      align-items: center;
      position: relative;

      &:first-child {
        box-sizing: border-box;
        flex: 1 1 40%;
        max-width: 200px;
        overflow: hidden;

        .reserve {
          display: block;
          box-sizing: border-box;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          position: relative;
          background: ${buttonSecondaryBackground};
          border-radius: 0.75rem;
          opacity: 0.75;
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
          padding-left: 2.5rem;
          padding-right: 1rem;
          width: 100%;

          .icon {
            position: absolute;
            top: 0.6rem;
            left: 0.5rem;
          }
        }
      }

      &:last-child {
        border-radius: 0.5rem;
        padding-left: 1rem;
        flex: 1 1 60%;
        opacity: 0.5;
        transition: opacity 0.15s;
        &:hover {
          opacity: 1;
        }
      }

      .assistant-icon {
        margin-left: 0.6rem;
      }

      .items {
        box-sizing: border-box;
        flex: 1 1 40%;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;

        > div {
          display: flex;
          flex-flow: column wrap;
          justify-content: center;
          box-sizing: border-box;
          padding: 0.5rem 0.6rem;

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
