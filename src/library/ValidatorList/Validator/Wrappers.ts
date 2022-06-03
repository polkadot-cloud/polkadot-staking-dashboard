// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  backgroundValidator,
  borderPrimary,
  textSecondary,
  primary,
  buttonPrimaryBackground,
} from 'theme';

export const Wrapper = styled.div<any>`
  display: flex;
  flex-flow: row wrap;
  width: 100%;
  height: ${(props) => (props.format === 'nomination' ? '5.6rem' : '3.2rem')};
  position: relative;
  margin: 0.5rem;

  > .inner {
    background: ${backgroundValidator};
    box-sizing: border-box;
    flex: 1;
    border-radius: 0.75rem;
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
        height: 2.2rem;
      }
      svg {
        margin: 0;
      }
    }

    .label {
      margin-left: 0.3rem;
      color: ${textSecondary};

      &.comm {
        margin: 0 0.3rem;
      }

      &.warning {
        color: #d2545d;
        display: flex;
        flex-flow: row wrap;
        align-items: center;
        padding-right: 0.35rem;
      }
      button {
        color: ${textSecondary};
        &:hover {
          opacity: 0.75;
        }
        &.active {
          color: ${primary};
        }
      }
    }
    .select {
      margin: 0 0.75rem 0 0.25rem;
      overflow: hidden;
      display: block;
      background: ${buttonPrimaryBackground};
      border-radius: 0.25rem;
      width: 1.4rem;
      height: 1.4rem;
      * {
        cursor: pointer;
        width: 1.4rem;
        height: 1.4rem;
      }
      svg {
        width: 1.1rem;
        height: 1.1rem;
      }
      .checkbox {
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: center;
        padding: 0;
        font-size: 1rem;
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

  h4 {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    line-height: 2rem;
    padding-left: 2.2rem;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const NominationStatusWrapper = styled.div<{ status: string }>`
  margin-right: 0.35rem;
  padding: 0 0.5rem;

  h5 {
    color: ${(props) => (props.status === 'active' ? 'green' : textSecondary)};
    opacity: ${(props) => (props.status === 'active' ? 1 : 0.5)};
    margin: 0;
    display: flex;
    flex-flow: row nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const Separator = styled.div`
  width: 100%;
  height: 1px;
  border-bottom: 1px solid ${borderPrimary};
`;

export const MenuPosition = styled.div`
  position: absolute;
  top: -10px;
  right: 10px;
  width: 0;
  height: 0;
  opacity: 0;
`;
export default Wrapper;
