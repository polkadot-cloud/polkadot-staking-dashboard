import { motion } from "framer-motion";
import styled from 'styled-components';
import { MAX_ASSISTANT_INTERFACE_WIDTH } from '../../constants';

export const Wrapper = styled(motion.div) <any>`
  position: absolute;
  right: -600px;
  top: 0;
  width: 100%;
  max-width: ${MAX_ASSISTANT_INTERFACE_WIDTH}px;
  height: 100%;
  z-index: 2;
  display: flex;
  flex-flow: column nowrap;
`;

export const ContentWrapper = styled.div`
  border-radius: 0.8rem;
  display: flex;
  flex-flow: column nowrap;
  overflow: auto;
  flex-grow: 1;
  background: rgba(215,215,215,0.96);
  padding: 0 0.75rem;
  margin: 0.75rem;
`;

export const ListWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  flex-grow: 1;
  align-content: flex-start;
`;

export const ItemWrapper = styled(motion.div)`
  display: flex;
  width: 50%;
  height: 200px;
  overflow: auto;
  
  .item {
    background: #f8f8f8;
    border-radius: 1rem;
    flex: 1;
    margin: 0.4rem;
    padding: 0 0.75rem;
    display: flex;
    flex-flow: column nowrap;
    align-items: flex-start;

    > h4 {
      font-weight: normal;
      margin: 0.65rem 0;
      color: #666;
      text-transform: uppercase;
      font-size: 0.7rem;
    }
    > h2 {
      margin-top: 0;
    }
  }
`;

export default Wrapper;