import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
`;

export const StakeSections = styled.div`
  width: 100%;
  max-width: 1000px;
  display: flex;
  flex-flow: row wrap;
`;

export const Section = styled.div`
  flex: 1;
  display: flex;
  padding-right: 0.5rem;

  &:last-child {
      padding-right: 0;
    }

  > div {
    flex: 1;
    background: white;
    border-radius: 0.75rem;
    margin-right: 1rem;
    padding: 0 1rem;
  }

`

export default Wrapper;