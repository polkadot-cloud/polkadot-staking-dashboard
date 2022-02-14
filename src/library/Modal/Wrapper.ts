import styled from 'styled-components';
import { motion } from 'framer-motion';

// Blurred background modal wrapper
export const Wrapper = styled(motion.div)`
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 7;
    backdrop-filter: blur(6px);

    /* modal content wrapper */
    .content_wrapper {
      height: 100%;
      display: flex;
      flex-flow: row wrap;
      justify-content: center;
      align-items: center;
      padding: 1rem 2rem;

      /* click anywhere behind modal content to close */
      .close {
          position: fixed;
          width: 100%;
          height: 100%;
          z-index: 8;
          cursor: default;
      }

      /* modal content */
      .content {
        width: 100%;
        max-width: 500px;
        padding: 1rem;
        background: white;
        z-index: 9;
        border-radius: 0.75rem;
      }
    }
`;

export const ContentWrapper = styled(motion.div)`
  width: 100%;
  max-width: 500px;
  padding: 1rem;
  background: white;
  z-index: 9;
  border-radius: 0.75rem;
`;

export default Wrapper;