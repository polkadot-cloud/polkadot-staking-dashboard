import styled from 'styled-components';
import { motion } from "framer-motion";

export const Wrapper = styled(motion.button) <any>`
  border-radius: 0.5rem;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
  background: #d33079;
  flex: 1;
  width: 100%;
  padding: 0.75rem 0.5rem;
  margin: 0.5rem 0 1.5rem 0;
  font-size: 1rem;
  color: white;
  font-variation-settings: 'wght' 600;
  transition: background 0.2s;

  &:hover {
    background: #C0236A;
  }
`;

export default Wrapper;