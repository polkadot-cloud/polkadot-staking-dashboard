import styled from 'styled-components';
import { motion } from "framer-motion";

export const Wrapper = styled(motion.div) <any>`
  width: 100%;
  border-top: 1px solid #eee;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: ${props => props.open === true ? `flex-start` : `center`};
  font-size: 0.75rem;
  color: #444;
  position: relative;

  .row {
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    align-content: center;
    overflow-x: auto;

    /* top row (always visible on collapsed) */
    &:first-child {
      background: #f2f2f2;
    }

    /* bottom row (collapsed by default) */
    &.details {
      padding: 1rem;
      display: flex;
      flex-flow: row wrap;
      justify-content: flex-start;
      align-content: flex-start;
      flex: 1;

      > div {
        padding: 0.25rem 1.5rem 0.25rem;
      }
      h2 {
        color: white;
        margin: 0.5rem;
      }
      p {
        font-size: 0.9rem;
        font-variation-settings: 'wght' 600;
        color: white;
        &.desc {
          margin-top: 0.4rem;
          font-variation-settings: 'wght' 420;
          font-size: 0.8rem;
        }
      }
    }

    p {
      margin: 0 0.25rem;
      color: #666;
    }
    .separator {
      border-left: 1px solid #ccc;
      margin: 0 0.3rem;
      width: 1px;
      height: 1rem;
    }
    .stat_separator {
        margin: 0 0.25rem;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
      }
  
    /* left and right sections for each row*/
    > section {
      padding: 0.5rem 0.5rem;

      /* left section */
      &:nth-child(1) {
        display: flex;
        flex-flow: row wrap;
        align-items: center;
        flex: 1;
        .network_icon {
          margin-right: 0.5rem;
          width: 1.5rem;
          height: 1.5rem;
        }
      }

      /* right section */
      &:last-child {
        flex-grow: 1;
        display: flex;
        align-items: center;
        flex-flow: row-reverse wrap;
        button {
          background: #eee;
          border-radius: 0.4rem;
          padding: 0.25rem 0.5rem;
          color: #444;
        }
        span {
          &.pos {
            color: #3eb955;
          }
          &.neg {
            color: #d2545d;
          }
        }
      }
    }
  }
`;

export const ConnectionSymbol = styled.div<any>`
  width: 10px;
  height: 10px;
  background: ${props => props.color};
  border-radius: 50%;
  margin: 0 0.7rem;
`;

export default Wrapper;