import { motion } from "framer-motion";
import styled from 'styled-components';
import { MAX_ASSISTANT_INTERFACE_WIDTH } from '../../constants';

export const Wrapper = styled(motion.div)<any>`
  position: absolute;
  right: ${props => props.open === 0 ? `-600px` : `0px`};
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
  flex: 1;
  flex-grow: 1;
  background: rgba(240,240,240,0.95);
  padding: 0 0.75rem;
  margin: 0.75rem;
`;

export default Wrapper;