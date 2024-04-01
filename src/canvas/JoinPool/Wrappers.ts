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
    flex-grow: 1;

    @media (max-width: 1000px) {
      flex-flow: row wrap;
    }

    > div {
      display: flex;

      &.main {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        padding-right: 4rem;

        @media (max-width: 1000px) {
          flex-basis: 100%;
          padding-right: 0;
        }
      }

      &.side {
        min-width: 450px;

        @media (max-width: 1000px) {
          flex-grow: 1;
          flex-basis: 100%;
          margin-top: 0.5rem;
        }

        > div {
          width: 100%;
        }
      }
    }
  }
`;

export const TitleWrapper = styled.div`
  border-bottom: 1px solid var(--border-secondary-color);
  display: flex;
  flex-direction: column;
  margin: 2rem 0 1.55rem 0;
  padding-bottom: 0.1rem;
  width: 100%;

  > .inner {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
    width: 100%;

    > div {
      display: flex;
      flex: 1;

      &:nth-child(1) {
        max-width: 4rem;
      }

      &:nth-child(2) {
        padding-left: 1rem;
        flex-direction: column;

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
          margin-top: 1rem;

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
              padding: 0.3rem 0.6rem;
              margin-left: 1rem;
              font-size: 1.1rem;

              &.blocked {
                color: var(--status-warning-color);
                border-color: var(--status-warning-color);
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

export const JoinFormWrapper = styled.div`
  background: var(--background-canvas-card);
  border: 0.75px solid var(--border-primary-color);
  box-shadow: var(--card-shadow);
  border-radius: 1.5rem;
  padding: 1.5rem;
  width: 100%;

  @media (max-width: 1000px) {
    margin-top: 1rem;
  }

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
  margin: 0.5rem 0.5rem 0.5rem 0rem;

  @media (max-width: 600px) {
    margin-right: 0;
  }

  h3,
  p {
    padding: 0 0.5rem;
  }

  h4 {
    font-size: 1.15rem;
  }

  p {
    color: var(--text-color-tertiary);
    margin: 0.35rem 0 0 0;
  }

  > h3,
  h4 {
    color: var(--text-color-secondary);
    font-family: Inter, sans-serif;
    margin: 0;
    display: flex;
    align-items: center;

    @media (max-width: 600px) {
      flex-wrap: wrap;
    }

    > span {
      background-color: var(--background-canvas-card-secondary);
      color: var(--text-color-secondary);
      font-family: InterBold, sans-serif;
      border-radius: 1.5rem;
      padding: 0rem 1.25rem;
      margin-right: 1rem;
      height: 2.6rem;
      display: flex;
      align-items: center;

      @media (max-width: 600px) {
        flex-grow: 1;
        justify-content: center;
        margin-bottom: 1rem;
        margin-right: 0;
        height: 2.9rem;
        width: 100%;

        &:last-child {
          margin-bottom: 0;
        }
      }

      &.balance {
        padding-left: 0.5rem;
      }

      > .icon {
        width: 2.1rem;
        height: 2.1rem;
        margin-right: 0.3rem;
      }
      &.inactive {
        color: var(--text-color-tertiary);
        border: 1px solid var(--border-secondary-color);
      }
    }
  }
`;

export const GraphWrapper = styled.div`
  padding: 0 4rem 0 1rem;
  margin-top: 2rem;
  position: relative;
  width: 100%;

  @media (max-width: 1000px) {
    padding: 0 0 0 1rem;
  }

  > .inner {
    position: absolute;
    width: 100%;
    height: 100%;
    padding-left: 1rem;
    padding-right: 4rem;

    @media (max-width: 1000px) {
      padding-right: 1.5rem;
    }
  }
`;

export const AddressesWrapper = styled.div`
  display: flex;
  padding: 0rem 0.25rem;
  flex-wrap: wrap;
  width: 100%;

  > section {
    display: flex;
    flex-direction: column;
    flex-basis: 50%;
    margin: 0.9rem 0 0.7rem 0;

    @media (max-width: 600px) {
      flex-basis: 100%;
    }

    > div {
      display: flex;
      flex-direction: row;
      align-items: center;

      > span {
        margin-right: 0.75rem;
      }

      > h4 {
        color: var(--text-color-secondary);
        font-family: InterSemiBold, sans-serif;
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: flex;
        width: 100%;

        &.heading {
          font-family: InterBold, sans-serif;
        }

        > .label {
          margin-left: 0.75rem;

          > button {
            color: var(--text-color-tertiary);
          }
        }
      }
    }
  }
`;

export const GrahpStatsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  @media (min-width: 1001px) {
    > div:last-child {
      margin-top: 1.25rem;
    }
  }

  @media (max-width: 1000px) {
    > div {
      &:first-child {
        order: 2;
        margin-top: 1.5rem;
        margin-bottom: 0;
      }
      &:last-child {
        order: 1;
      }
    }
  }
`;
