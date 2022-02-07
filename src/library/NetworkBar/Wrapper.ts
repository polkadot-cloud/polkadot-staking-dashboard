import styled from 'styled-components';
import { motion } from "framer-motion";

export const Wrapper = styled(motion.div) <any>`
  width: 100%;
  background: white;
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

    p {
      margin: 0 0.25rem;
      color: #666;
    }

    > section {
      padding: 0.5rem 0.5rem;

      .separator {
          border-left: 1px solid #ccc;
          margin: 0 0.3rem;
          width: 1px;
          height: 1rem;
        }

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
      &:last-child {
        flex-grow: 1;
        display: flex;
        align-items: center;
        flex-flow: row-reverse wrap;

        button {
          background: #eee;
          border-radius: 0.4rem;
          margin: 0 0.25rem;
          padding: 0.25rem 0.5rem;
          color: #444;
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