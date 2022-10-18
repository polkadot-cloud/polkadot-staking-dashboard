// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { SMALL_FONT_SIZE_MAX_WIDTH } from 'consts';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import {
  backgroundDropdown,
  backgroundModalItem,
  borderPrimary,
  modalBackground,
  networkColor,
  textSecondary,
} from 'theme';

export const Wrapper = styled.div<{ format?: string; inModal?: boolean }>`
  display: flex;
  flex-flow: row wrap;
  width: 100%;
  height: ${(props) => (props.format === 'nomination' ? '6rem' : '3.2rem')};
  position: relative;
  margin: 0.5rem;

  > .inner {
    background: ${(props) =>
      props.inModal ? backgroundModalItem : backgroundDropdown};
    border: 1px solid ${borderPrimary};

    ${(props) =>
      props.inModal &&
      `
      border: none;`}
    box-sizing: border-box;
    flex: 1;
    border-radius: 1rem;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    align-items: center;
    flex: 1;
    overflow: hidden;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    padding: 0;

    .row {
      box-sizing: border-box;
      flex: 1 0 100%;
      height: 3.2rem;
      display: flex;
      flex-flow: row nowrap;
      justify-content: flex-start;
      align-items: center;
      padding: 0 0.5rem;

      &.status {
        height: 2.8rem;
      }
      svg {
        margin: 0;
      }
    }
  }
`;

export const Labels = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
  align-items: center;
  overflow: hidden;
  flex: 1 1 100%;
  padding: 0 0 0 0.25rem;
  height: 3.2rem;

  button {
    padding: 0 0.1rem;
    @media (min-width: ${SMALL_FONT_SIZE_MAX_WIDTH}px) {
      padding: 0 0.2rem;
    }

    color: ${textSecondary};
    &:hover {
      opacity: 0.75;
    }
    &.active {
      color: ${networkColor};
    }
    &:disabled {
      opacity: 0.35;
    }
  }

  .label {
    position: relative;
    color: ${textSecondary};
    margin: 0 0.2rem;
    @media (min-width: ${SMALL_FONT_SIZE_MAX_WIDTH}px) {
      margin: 0 0.2rem;

      &.pool {
        margin: 0 0.4rem;
      }
    }
    &.button-with-text {
      margin-right: 0;

      button {
        color: ${networkColor};
        font-size: 0.95rem;
        display: flex;
        flex-flow: row wrap;
        align-items: center;

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
  box-sizing: border-box;
  display: flex;
  flex-flow: row nowrap;
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
  box-sizing: border-box;
  display: flex;
  margin-right: 0.5rem;
  flex-flow: row nowrap;
  align-items: center;
  align-content: center;
  overflow: hidden;
  flex: 1 1 25%;
  position: relative;

  .inner {
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 3.2rem;
    padding: 0;
  }
  h4 {
    position: absolute;
    top: 0;
    width: 100%;
    height: 3.2rem;
    line-height: 3.2rem;
    padding: 0 0 0 0.4rem;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    > span {
      color: ${textSecondary};
      opacity: 0.75;
      font-size: 0.88rem;
      margin-left: 0.35rem;
      position: relative;
      top: -0.1rem;
    }
  }
`;

export const ValidatorStatusWrapper = styled.div<{ status: string }>`
  margin-right: 0.35rem;
  padding: 0 0.5rem;

  h5 {
    color: ${(props) => (props.status === 'active' ? 'green' : textSecondary)};
    opacity: ${(props) => (props.status === 'active' ? 0.8 : 0.5)};
    margin: 0;
    display: flex;
    flex-flow: row nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const SelectWrapper = styled.button`
  background: ${modalBackground};
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
  width: 100%;
  height: 1px;
  border-bottom: 1px solid ${borderPrimary};
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

export const TooltipPosition = styled.div`
  position: absolute;
  top: 0;
  left: 0.75rem;
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

export default Wrapper;
