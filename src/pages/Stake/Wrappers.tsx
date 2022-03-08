// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
`;

export const StakingAccount = styled.div<any>`
  margin-bottom: ${props => props.last === true ? `none` : '1rem'};
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  h4 {
    color: #333;
  }
`;
export const NominateWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  align-items: flex-start;
  position: relative;

  > button {
    display: flex;
    flex-flow: column wrap;
    flex-basis: 100%;
    align-items: center;
    justify-content: flex-start;
    padding: 1rem;
    background: rgba(240,240,240,0.7);
    height: 170px;
    border-radius: 0.85rem;

    &:first-child{
      margin-bottom: 1rem;
    }
    h2 {
      font-size: 1.15rem;
      color: #222; 
      margin: 0 0 0.4rem;
      font-variation-settings: 'wght' 500;
    }
    p {
      color: #222;
      font-size: 0.87rem;
      line-height: 1.3rem;
      padding: 0.5rem 1rem 0 1rem;
      text-align: center;
      font-variation-settings: 'wght' 500;
      margin: 0;
    }
    .foot {
      width: 100%;
      display: flex;
      flex-flow: column nowrap;
      align-items: center;
      justify-content: flex-end;
      flex: 1;
      margin-top: 0.75rem;
    }
    .go {
      color: #555;
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      justify-content: center;
      padding: 0;
      transition: color 0.2s;
    }
    &:hover {
      .go {
        color: #d33079;
      }
    }
  }
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

`

export default Wrapper;