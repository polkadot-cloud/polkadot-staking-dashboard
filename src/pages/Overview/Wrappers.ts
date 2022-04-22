import styled from "styled-components";
import { borderPrimary } from "../../theme";

export const AccountWrapper = styled.div`
  padding: 0 1.25rem 0rem 1.25rem;
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-flow: column wrap;

  .account {
    width: 100%;
    display: flex; 
    flex-flow: row wrap;
    align-items: center;
    padding: 0;
    margin-top: 1.25rem;

    .icon {
      position: relative;
      top: 0.1rem;
    }
    h4 {
      margin: 0rem 0.5rem;
      padding: 0;

      > .sep {
        border-right: 1px solid ${borderPrimary};
        margin: 0 0.7rem;
        width: 1px;
        height: 1.25rem;
      }
      > .addr {
        opacity: 0.75;
      }
    }

    > *:last-child {
      flex-grow: 1;
      display: flex;
      flex-flow: row-reverse wrap;

      > .copy {
        opacity: 0.5;
        cursor: pointer;
        transition: opacity 0.1s;
        &:hover {
          opacity: 1;
        }
      }
    }
  }
`;

export const Separator = styled.div`
  border-bottom: 1px solid ${borderPrimary};
  margin-top: 0.8rem;
  width: 100%;
  height: 1px;
`;