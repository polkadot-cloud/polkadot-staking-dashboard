// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { textSecondary, borderPrimary, gridColor, primary } from '../../theme';

export const Wrapper = styled.div`
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;

  h3 {
    margin-bottom: 0;
  }
`;

export const StakingAccount = styled.div<any>`
  margin-bottom: ${props => props.last === true ? `none` : '1rem'};
  display: flex;
  flex-flow: row wrap;
  h4 {
    color: ${textSecondary};
  }
`;

export const HeaderWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  padding: 0 0.25rem;

  > section {
    color: ${textSecondary};
    display: flex;
    flex-flow: row wrap;
    align-items: center;
  }

  > section:last-child {
    flex: 1;
    justify-content: flex-end;

    .progress {
      color: ${textSecondary};
      opacity: 0.5;
    }

    .complete {
      margin: 0;
      color: ${primary};
    }

    span {
      margin-right: 1rem;
    }
  }

  h2 {
    margin: 0;
    padding: 0.3rem 0;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    align-items: center;
  }
`;

export const FooterWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: flex-end;
  padding: 0 0.25rem;
  margin-top: 1rem;
`;


export const Section = styled.div`
  flex: 1;
  display: flex;
  padding-right: 0.5rem;

  &:last-child {
      padding-right: 0;
    }

  > div {
    flex: 1;
    background: white;
    border-radius: 0.75rem;
    margin-right: 1rem;
    padding: 0 1rem;
  }
`;

export const Separator = styled.div`
  border-bottom: 1px solid ${borderPrimary};
  width: 100%;
  margin: 1.5rem 0;
`;

export const Spacer = styled.div`
  width: 100%;
  margin: 0.75rem 0;
`;

export const BondStatus = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: flex-end;
  margin-top: 1rem;

  .bars {
    width: 100%;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    align-items: flex-end;
    margin-top: 1rem;

    > section {
      box-sizing: border-box;
      padding: 0 0.15rem;

      &:nth-child(1) {
        flex-basis: 15%;
      }
      &:nth-child(2) {
        flex-basis: 40%;
      }
      &:nth-child(3) {
        flex-basis: 45%;
      }
      h4, h5 {
        color: ${textSecondary};
      }

      h4 {
        display: flex;
        flex-flow: row wrap;
        align-items: center;
        margin-bottom: 0.4rem;
      }
      h5 {
        margin: 0;
        position: relative;
        opacity: 0.75;
      }
      .bar {
        background: ${gridColor};
        width: 100%;
        padding: 0.4rem 0.5rem;
        overflow: hidden;
        position: relative;
      }
      &:first-child .bar {
        border-top-left-radius: 1rem;
        border-bottom-left-radius: 1rem;
        h5 {
          margin-left: 0.25rem;
        }
      }
      &:last-child .bar {
        border-top-right-radius: 1rem;
        border-bottom-right-radius: 1rem;
      }
    }

    .progress {
      background: ${primary};
      position: absolute;
      bottom: 0;
      left: 0;
      height: 0.15rem;
      width: 100%;
    }
  }
`;

export default Wrapper;