import styled from "styled-components";
import { backgroundLabel } from '../../../theme';

export const Wrapper = styled.div`
  background: ${backgroundLabel};
  margin: 0.6rem 0;
  padding: 0.5rem 0.75rem;
  color: rgba(255, 144, 0, 1);
  border-radius: 0.75rem;
  display: flex;
  flex-flow: row wrap;
  align-items: center;

  .icon {
    margin-right: 0.3rem;
  }

  > h4 {
    margin: 0;
  }
`;