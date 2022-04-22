import styled from "styled-components";
import { backgroundLabel, textSecondary, primary, secondary, textInvert } from "../../../theme";

export const BondInputWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row wrap;

  > section {
    &:first-child {
      flex-basis: 30%;
      flex: 1;
      min-width: 300px;
      max-width: 400px;

      input {
        width: 100%;
        margin-top: 0.5rem;
      }
    }
    &:last-child {
      flex-basis: 70%;
      flex-grow: 1;
    }
  }
`;

export const Warning = styled.div`
  background: ${backgroundLabel};
  margin: 0.6rem 0;
  padding: 0.5rem 0.75rem;
  color: rgba(255, 144, 0, 1);
  border-radius: 0.75rem;
  display: flex;
  flex-flow: row wrap;
  align-items: center;

  h4 {
    margin: 0 0 0 0.75rem;
  }
`;


export const BondStatus = styled.div<any>`
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
        background: ${backgroundLabel};
        width: 100%;
        padding: 0.4rem 0.5rem;
        overflow: hidden;
        position: relative;
        transition: background 0.15s;
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

      &.invert {
        h4 {
          color: ${primary};
        }
        h5 {
          opacity: 1;
          color: white;
        }
        .bar {
          background: ${secondary};
        }
      }
    }
  }
`;