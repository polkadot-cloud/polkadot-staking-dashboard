// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';

export const MainWrapper = styled.div<any>`
  flex-basis: 65%;
  max-width: 65%;
  overflow: hidden;
  min-width: 500px;
  flex-grow: 1;
  ${props => props.paddingLeft && `
  padding-left: 1rem;`
  }
  ${props => props.paddingRight && `
  padding-right: 1rem;`
  }
`;

export const GraphWrapper = styled.div<any>`
  box-sizing: border-box;
  padding: 1rem 1.2rem;
  border-radius: 1rem;
  background: rgba(255,255,255,0.7);
  display: flex;
  flex-flow: column nowrap;
  align-content: flex-start;
  align-items: flex-start;
  width: 100%;
  flex: 1;
  margin-top: 1rem;
  position: relative;

  .label {
    position: absolute;
    right: 10px;
    top: 10px;
    font-size: 0.8rem;
    font-variation-settings: 'wght' 550;
    background: #d33079;
    border-radius: 0.3rem;
    padding: 0.2rem 0.4rem;
    color: #fff;
    opacity: 0.8;
  }

  h1, h5 {
    margin: 0;
    padding: 0.25rem 0;
    display: flex;
    flex-flow: row wrap;
    align-content: flex-end;
    align-items: flex-end;
    justify-content: flex-start;

    .fiat {
      font-size: 1rem;
      color: #555;
      margin-top: 0.25rem;
    }
  }
  h1 {
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    align-items: center;
  }
  p {
    margin: 0.25rem 0 0;
  }

  h3 {
    margin-top: 0.25rem;
  }
  h4 {
    margin-bottom: 0.5rem;
    line-height: 1.3rem;
  }
  .small_button {
    background: #f1f1f1;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
  }
  .graph {
    position: relative;
    flex: ${props => props.flex ? 1 : 0};
    flex-flow: row wrap;
    justify-content: center;
    width: 100%;
    margin-top: 1.5rem;
  }
  .graph_line {
    background: #f1f1f1;
    background: linear-gradient(101deg, rgba(241,241,241,1) 0%, rgba(244,244,244,1) 100%);
    border-radius: 0.75rem;
    margin-top: 2rem;
    margin-left: 1rem;
    padding: 0.5rem 1rem;
  }
  .graph_with_extra {
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: flex-start;
    height: 190px;

    .extra {
      flex: 1;
      display: flex;
      flex-flow: row wrap;
      justify-content: flex-end;
      align-items: flex-end;
      align-content: flex-end;
      height: 190px;
      border: 1px solid;
    }
  }

  .change {
    margin-left: 0.6rem;
    font-size: 0.9rem;
    color: white;
    border-radius: 0.75rem;
    padding: 0.15rem 0.5rem;
    font-variation-settings: 'wght' 550;
    &.pos {
      background: #3eb955;
    }
    &.neg {
      background: #d2545d;
    }
  }
`;

export const SecondaryWrapper = styled.div`
  border-radius: 1rem;
  flex: 1;
  width: 100%;
  min-width: 400px;
`;
