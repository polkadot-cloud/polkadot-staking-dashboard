import styled from 'styled-components';

export const Wrapper = styled.div<any>`
  width: 100%;
  background: #888;
  border-bottom: 1px solid #ccc;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: center;
  font-size: 0.7rem;
  color: white;

  button {
    font-size: 0.7rem;
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