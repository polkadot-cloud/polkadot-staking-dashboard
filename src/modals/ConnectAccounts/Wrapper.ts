import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-flow: column wrap;
  margin: 0.5rem 0;

  h2 {
    margin-top: 0;
  }

  button {
    border: 1px solid #eee;
    border-radius: 0.5rem;
    padding: 0.5rem 1rem;
    transition: background 0.1s;
    font-size: 1rem;

    &:hover {
      background: #fafafa;
    }
  }
`;

export default Wrapper;