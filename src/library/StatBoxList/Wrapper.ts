import styled from 'styled-components';
import { motion } from "framer-motion";

export const Wrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  overflow-x: auto;
  > h2 {
    margin: 0.2rem 0;
  }
  margin: 1rem 0;
  flex-shrink: 0;
`;

export const ListWrapper = styled.div`
  height: 120px;
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
  margin-right: 1.25rem;
  flex-basis: 33%;
  min-width: 250px;
  max-width: 275px;
  flex-grow: 1;
  flex-shrink: 0;
  background: rgba(255,255,255,0.9);
  display: flex;
  flex-flow: column wrap;
  overflow: hidden;

  > section {
    padding: 0 1.15rem;

    &:first-child {
      flex-grow: 1;
      display: flex;
      flex-flow: column wrap;
      justify-content: flex-end;
      padding-bottom: 0.2rem;
      h1 {
        font-variation-settings: 'wght' 510;
        margin: 0;
        padding: 0.85rem 0;
        font-size: 1.5rem;
      }
    }
    &:last-child {
      h4 {
      margin: 0;
      padding-bottom: 1rem;
    }
  }
}
`;

export default Wrapper;