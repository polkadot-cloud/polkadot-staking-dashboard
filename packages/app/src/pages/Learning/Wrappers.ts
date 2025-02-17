// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { SectionFullWidthThreshold } from 'consts'
import styled from 'styled-components'

export const ResourcesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 1rem;

  @media (min-width: ${SectionFullWidthThreshold}px) {
    flex-direction: row;
    gap: 1.5rem;
  }
`

export const PathWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex-basis: 100%;
  height: fit-content;

  @media (min-width: ${SectionFullWidthThreshold}px) {
    flex-basis: 40%;
  }

  .path-card {
    transition: all 0.15s ease;
    border: 1px solid var(--border-primary-color);

    &:hover {
      border-color: var(--accent-color-primary);
    }

    &.active {
      background: var(--background-primary);
      border-color: var(--accent-color-primary);
    }

    .path-header {
      padding: 1.25rem;
      cursor: pointer;

      h3 {
        font-family: InterSemiBold, sans-serif;
        font-size: 1.1rem;
        margin-bottom: 0.35rem;
        color: var(--text-color-primary);
      }

      p {
        color: var(--text-color-secondary);
        font-size: 0.95rem;
        margin: 0;
      }
    }

    .guide-list {
      overflow: hidden;
      border-top: 1px solid var(--border-primary-color);
      padding: 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      .guide-button {
        width: 100%;
        text-align: left;
        background: none;
        border: none;
        padding: 0.75rem 1rem;
        border-radius: 0.75rem;
        color: var(--text-color-primary);
        font-size: 0.95rem;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          background: var(--button-hover-background);
        }

        &.active {
          background: var(--button-hover-background);
          color: var(--accent-color-primary);
          font-family: InterSemiBold, sans-serif;
        }
      }
    }
  }
`

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex-basis: 100%;

  @media (min-width: ${SectionFullWidthThreshold}px) {
    flex-basis: 60%;
  }

  .content {
    padding: 1.75rem;

    .guide-title {
      font-family: InterSemiBold, sans-serif;
      font-size: 1.5rem;
      margin-bottom: 1.5rem;
      color: var(--text-color-primary);
    }

    .guide-intro {
      font-size: 1.1rem;
      line-height: 1.6;
      color: var(--text-color-primary);
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--border-primary-color);
    }

    .guide-content {
      .guide-paragraph {
        color: var(--text-color-primary);
        line-height: 1.6;
        margin-bottom: 1.5rem;
        font-size: 1.05rem;
      }

      .guide-list {
        list-style: none;
        padding: 0.5rem 0 1rem 0;
        margin: 0;

        li {
          position: relative;
          padding-left: 1.75rem;
          margin-bottom: 1rem;
          line-height: 1.5;
          color: var(--text-color-primary);
          font-size: 1.05rem;

          &:before {
            content: '•';
            position: absolute;
            left: 0.5rem;
            color: var(--accent-color-primary);
            font-size: 1.2rem;
          }

          &:last-child {
            margin-bottom: 0.5rem;
          }
        }
      }
    }

    .guide-sections {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;

      .guide-section {
        h3 {
          font-family: InterSemiBold, sans-serif;
          font-size: 1.2rem;
          color: var(--text-color-primary);
          margin-bottom: 1rem;
        }
      }
    }

    .guide-note {
      margin-top: 2rem;
      padding: 1rem 1.25rem;
      background: var(--background-secondary);
      border-radius: 0.75rem;
      font-size: 1rem;
      line-height: 1.5;
      color: var(--text-color-primary);

      span {
        color: var(--accent-color-primary);
        font-family: InterSemiBold, sans-serif;
      }
    }
  }
`
