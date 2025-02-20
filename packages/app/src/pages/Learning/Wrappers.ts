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

  /* New styles applied to path-card and its inner elements */
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
        transition: all 0.2s ease;

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

    /* Guide Header styling - Updated for better tag appearance */
    .guide-header {
      margin-bottom: 2rem;

      h2 {
        font-family: InterSemiBold, sans-serif;
        font-size: 1.5rem;
        margin-bottom: 0.75rem;
        color: var(--text-color-primary);
      }

      .guide-tags {
        display: flex;
        gap: 0.5rem;
        margin-top: 0.75rem;
        flex-wrap: wrap;

        .tag {
          padding: 0.35rem 0.85rem;
          border-radius: 2rem;
          background: var(--accent-color-primary);
          color: white;
          font-size: 0.85rem;
          font-weight: 500;
          letter-spacing: 0.01em;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
          display: inline-flex;
          align-items: center;
          transition: all 0.15s ease;

          &:hover {
            background: var(--accent-color-secondary);
            transform: translateY(-1px);
            box-shadow: 0 2px 3px rgba(0, 0, 0, 0.15);
          }
        }
      }
    }

    /* Simple guide content (no sections) */
    .guide-simple-content {
      padding: 0.5rem;
      background: var(--background-primary);
    }

    /* Guide sections styling - for complex guides */
    .guide-sections {
      .guide-section {
        margin-bottom: 1rem;
        border: 1px solid var(--border-primary-color);
        border-radius: 0.75rem;
        overflow: hidden;
        transition: all 0.2s ease;

        &:hover {
          border-color: var(--accent-color-primary);
        }

        .section-header {
          padding: 1rem 1.25rem;
          background: var(--background-primary);
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;

          .section-title {
            font-family: InterSemiBold, sans-serif;
            margin: 0;
            font-size: 1.1rem;
            color: var(--text-color-primary);
          }

          .section-arrow {
            transition: transform 0.2s ease;

            &.expanded {
              transform: rotate(180deg);
            }
          }
        }

        .section-content {
          padding: 0 1.25rem 1.25rem 1.25rem;
          overflow: hidden;

          .subsections {
            margin-top: 1rem;

            .subsection {
              margin-bottom: 1.5rem;
              padding-bottom: 1rem;
              border-bottom: 1px solid var(--border-primary-color);

              &:last-child {
                margin-bottom: 0;
                padding-bottom: 0;
                border-bottom: none;
              }

              .subsection-title {
                font-family: InterSemiBold, sans-serif;
                font-size: 1rem;
                margin-bottom: 0.75rem;
                color: var(--text-color-primary);
              }
            }
          }
        }
      }
    }

    /* List styling for both simple and complex guides */
    .interactive-list {
      list-style: none;
      padding: 0;
      margin: 0.5rem 0;

      .interactive-list-item {
        display: flex;
        align-items: flex-start;
        margin-bottom: 0.75rem;

        .bullet {
          color: var(--accent-color-primary);
          margin-right: 0.5rem;
          min-width: 8px;
        }

        &:last-child {
          margin-bottom: 0.25rem;
        }
      }
    }

    /* Table styling */
    .table-wrapper {
      overflow-x: auto;
      margin: 1rem 0;

      .interactive-table {
        width: 100%;
        border-collapse: collapse;

        th,
        td {
          padding: 0.75rem;
          border: 1px solid var(--border-primary-color);
          text-align: left;
        }

        th {
          background: var(--background-secondary);
          font-family: InterSemiBold, sans-serif;
        }

        tr:hover {
          background: var(--background-secondary);
        }
      }
    }

    /* Markdown content general styling */
    p {
      margin: 0.75rem 0;
      line-height: 1.6;
      color: var(--text-color-primary);
    }

    strong,
    b {
      font-family: InterSemiBold, sans-serif;
    }

    /* Blockquotes for notices and important information */
    blockquote {
      border-left: 4px solid var(--accent-color-primary);
      margin: 1rem 0;
      padding: 0.5rem 0 0.5rem 1rem;
      background-color: var(--background-secondary);
      border-radius: 0 0.5rem 0.5rem 0;

      p {
        margin: 0.5rem 0;
      }
    }

    /* Special styling for notices and warnings */
    .notice,
    .warning {
      margin: 1.5rem 0;
      padding: 1rem;
      border-radius: 0.75rem;
      background-color: var(--background-secondary);
      border-left: 4px solid var(--accent-color-primary);

      p {
        margin: 0.5rem 0;

        &:first-child {
          margin-top: 0;
        }

        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    .warning {
      border-left-color: #e74c3c;
    }

    /* Code blocks */
    code {
      background-color: var(--background-secondary);
      padding: 0.2rem 0.4rem;
      border-radius: 0.25rem;
      font-family: monospace;
      font-size: 0.9em;
    }

    pre {
      background-color: var(--background-secondary);
      padding: 1rem;
      border-radius: 0.5rem;
      overflow-x: auto;
      margin: 1rem 0;

      code {
        background-color: transparent;
        padding: 0;
      }
    }

    /* Links */
    a {
      color: var(--accent-color-primary);
      text-decoration: underline;
      transition: color 0.2s ease;

      &:hover {
        color: var(--accent-color-secondary);
      }
    }
  }
`
