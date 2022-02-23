import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-flow: column wrap;
  align-items: center;
  justify-content: flex-start;
  padding: 0.5rem;

  h2 {
    margin-top: 0;
  }

  button {
    border: 1px solid #eee;
    width: 100%;
    margin: 0.25rem 0;
    padding: 0.5rem;
    border-radius: 0.75rem;
    font-size: 1rem;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    background: #fbfbfb;

    &:hover {
      background: #fafafa;
    }
  }
`;

export default Wrapper;