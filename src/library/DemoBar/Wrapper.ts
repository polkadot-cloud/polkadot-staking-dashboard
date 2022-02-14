import styled from 'styled-components';

export const Wrapper = styled.div<any>`
  width: 100%;
  background: #222;
  border-bottom: 1px solid #ccc;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: center;
  font-size: 0.8rem;
  color: white;

  button {
    color: white;
  }

  > section {
    padding: 0.4rem 0.5rem;
  }

  > section:nth-child(2) {
    flex: 1;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-end;
  }
`;

export default Wrapper;