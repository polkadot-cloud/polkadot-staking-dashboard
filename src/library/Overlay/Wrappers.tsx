// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import {
  buttonPrimaryBackground,
  cardShadow,
  modalBackground,
  networkColor,
  shadowColor,
  textPrimary,
} from 'theme';

export const OverlayWrapper = styled.div`
  background: rgba(200, 200, 200, 0.45);
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 9;

  /* content wrapper */
  > div {
    height: 100%;
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    align-items: center;
    padding: 1rem 2rem;

    /* click anywhere behind overlay to close */
    .close {
      position: fixed;
      width: 100%;
      height: 100%;
      z-index: 8;
      cursor: default;
    }
  }
`;

export const HeightWrapper = styled.div<{ size: string }>`
  box-shadow: ${cardShadow} ${shadowColor};
  transition: height 0.5s cubic-bezier(0.1, 1, 0.2, 1);
  width: 100%;
  max-width: ${(props) => (props.size === 'small' ? '500px' : '700px')};
  max-height: 100%;
  border-radius: 1.5rem;
  z-index: 9;
  position: relative;
  overflow: hidden;
`;

export const ContentWrapper = styled.div`
  background: ${modalBackground};
  width: 100%;
  height: auto;
  overflow: hidden;
  position: relative;

  a {
    color: ${networkColor};
  }
  .header {
    width: 100%;
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    padding: 1rem 1rem 0 1rem;
  }
  .body {
    padding: 0.5rem 1.5rem 1rem 1.5rem;

    h4 {
      margin: 0.5rem 0;
    }
  }
`;

export const TitleWrapper = styled.div`
  padding: 1.5rem 1rem 0 1rem;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: center;
  width: 100%;

  > div {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    padding: 0 0.5rem;

    button {
      padding: 0;
    }

    path {
      fill: ${textPrimary};
    }

    &:first-child {
      flex-grow: 1;

      > h2 {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        font-family: 'Unbounded', 'sans-serif', sans-serif;
        font-size: 1.3rem;
        margin: 0;

        > button {
          margin-left: 0.85rem;
        }
      }
      > svg {
        margin-right: 0.9rem;
      }
    }
  }
`;

export const FilterListWrapper = styled.div`
  padding-bottom: 0.5rem;
  .item {
    background: ${buttonPrimaryBackground};
    border: 1px solid ${buttonPrimaryBackground};
    width: 100%;
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    border-radius: 1rem;
    padding: 1rem;
    margin: 1rem 0;

    &:last-child {
      margin-bottom: 0;
    }

    h4 {
      margin: 0;
    }

    svg {
      margin-right: 0.75rem;
    }
  }
`;
