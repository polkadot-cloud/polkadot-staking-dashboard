// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { backgroundValidator, borderPrimary, textSecondary } from '../../theme';

export const Wrapper = styled.div<any>`
  display: flex;
  flex-flow: row wrap;
  width: 100%;
  height: ${(props) => (props.format === 'nomination' ? '5.7rem' : '3.2rem')};
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

      &.status {
        height: 2.5rem;
      }
      svg {
        margin: 0;
      }
    }
  }
`;

export const Separator = styled.div`
  width: 100%;
  height: 1px;
  border-bottom: 1px solid ${borderPrimary};
`;

export const IdentityWrapper = styled(motion.div)`
  box-sizing: border-box;
  display: flex;
  margin-left: 0.75rem;
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

export const Labels = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
  align-items: center;
  overflow: hidden;
  flex: 1 1 100%;
  padding: 0 0.5rem;

  .label {
    margin-left: 0.35rem;
    color: #aaa;

    &.warning {
      color: #d2545d;
      display: flex;
      flex-flow: row wrap;
      align-items: center;
    }
    button {
      color: #aaa;
      &:hover {
        color: #666;
      }
      &.active {
        color: rgba(211, 48, 121, 0.85);
      }
    }
  }
`;

export const NominationStatusWrapper = styled.div<{ status: string }>`
  margin-right: 0.35rem;
  padding: 0 1rem;
  color: ${(props) => (props.status === 'active' ? 'green' : textSecondary)};
  opacity: ${(props) => (props.status === 'active' ? 1 : 0.75)};
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
