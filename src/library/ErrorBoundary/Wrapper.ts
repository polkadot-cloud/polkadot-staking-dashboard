import styled from 'styled-components';
import { textSecondary, networkColor } from 'theme';

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
  margin-top: 10rem;

  h1,
  h2 {
    color: ${textSecondary};
    button {
      color: ${networkColor};
      font-size: 1.25rem;

      &:hover {
        opacity: 0.75;
      }
    }
  }

  h3 {
    margin-bottom: 3rem;
    svg {
      color: ${textSecondary};
    }
  }
`;
