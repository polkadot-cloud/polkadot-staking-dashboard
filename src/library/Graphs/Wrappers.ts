// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';

export const SectionWrapper = styled.div<any>`
  box-sizing: border-box;
  padding: 1rem 1.2rem;
  border-radius: 1rem;
  background: rgba(255,255,255,0.7);
  display: flex;
  flex-flow: column nowrap;
  align-content: flex-start;
  align-items: flex-start;
  flex: 1;
  margin-top: 1.2rem;
`;

export const GraphWrapper = styled.div<any>`
  box-sizing: border-box;
  border-radius: 1rem;
  background: rgba(255,255,255,0.7);
  display: flex;
  flex-flow: column nowrap;
  align-content: flex-start;
  align-items: flex-start;
  flex: 1;
  margin-top: 1.2rem;
  position: relative;
  overflow: hidden;

  .inner {
    width: 100%;
    height: 100%;
  }

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
  .head {
    padding: 1rem 1.2rem 0 1.2rem;
  }

  h1, h4 {
    margin: 0;
    padding: 0.3rem 0;
    display: flex;
    flex-flow: row wrap;
    align-content: flex-end;
    align-items: flex-end;
    justify-content: flex-start;

    .fiat {
      font-size: 1rem;
      color: #555;
      margin-top: 0.2rem;
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
    margin-top: 0.4rem;
    margin-bottom: 0.5rem;
  }
  h4 {
    margin-top: 0.4rem;
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
    padding: 1rem 1.2rem;

  }
  .graph_line {
    border-radius: 0.75rem;
    margin-top: 1.5rem;
    margin-left: 1rem;
    padding: 1rem 1rem 0.5rem 1rem;
  }
  .graph_with_extra {
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: flex-start;
    height: 190px;
    flex: 1;

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