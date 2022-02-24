import styled from 'styled-components';
import { motion } from 'framer-motion';

export const Wrapper = styled.div`
  flex: 1;
  display: flex;
  flex-flow: column wrap;
  width: 100%;
`;
export const Item = styled(motion.div)`
  list-style: none;
  flex: 1;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  margin: 1rem 0.25rem;
  padding: 1.5rem 1rem;
  border-radius: 1rem;
  background: rgba(229,229,229,0.25);

  h5 {
    margin: 0 0 0.75rem;
    color: #b1185d;
    text-transform: uppercase;
    font-variation-settings: 'wght' 500;
  }

  p {
    margin: 0;
    color: #333;
    font-size: 0.9rem;
    font-variation-settings: 'wght' 500;
  }
`;