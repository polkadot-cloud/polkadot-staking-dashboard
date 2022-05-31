import styled from 'styled-components';
import { borderPrimary, primary } from 'theme';

export const SummaryWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  margin-bottom: 1rem;

  > section {
    flex-basis: 100%;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    align-items: flex-end;
    border-bottom: 1px solid ${borderPrimary};
    margin-top: 1rem;
    padding: 0.5rem 0 0.75rem 0;

    > div:first-child {
      width: 200px;
      display: flex;
      flex-flow: row wrap;
      align-items: flex-end;

      svg {
        color: ${primary};
      }
    }

    > div:last-child {
      flex-grow: 1;
      display: flex;
      flex-flow: row wrap;
      align-items: center;
    }
  }
`;
