import styled from 'styled-components';
import { backgroundLabel } from 'theme';

export const Wrapper = styled.div`
  background: ${backgroundLabel};
  margin: 0.6rem 0;
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  display: flex;
  flex-flow: row wrap;
  align-items: center;

  > h4 {
    margin: 0;

    .icon {
      color: rgba(255, 144, 0, 1);
      margin-right: 0.4rem;
    }
  }
`;
