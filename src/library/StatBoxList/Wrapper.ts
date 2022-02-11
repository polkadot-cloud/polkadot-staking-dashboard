import styled from 'styled-components';
import { motion } from "framer-motion";

export const Wrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  overflow-x: auto;
  > h2 {
    margin: 0.5rem 0;
  }
`;

export const ListWrapper = styled.div`
  height: 155px;
  display: flex;
  flex-flow: row nowrap;
  overflow-x: auto;
  padding-bottom: 1rem;
  overflow: hidden;
`;

export const Scrollable = styled.div`
  display: flex;
  flex-flow: row nowrap;
  overflow-x: auto;
  padding: 1rem 0;
  height: 100%;
  flex: 1;
`;

export const StatBoxWrapper = styled(motion.div)`
  border-radius: 1rem;
  margin-right: 1rem;
  flex-basis: 33%;
  min-width: 200px;
  max-width: 275px;
  flex-grow: 1;
  flex-shrink: 0;
  background: rgba(255,255,255,0.9);
  display: flex;
  flex-flow: column wrap;

  > section:first-child {
    flex-grow: 1;
  }
  > section:last-child {
    h3 {
      margin: 0;
      padding: 0.75rem 1rem;
    }
  }

`;

export default Wrapper;