import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row wrap;

  > section {
    &:first-child {
      flex-basis: 30%;
      flex: 1;
      min-width: 200px;
      max-width: 250px;

      h3 {
        margin: 0;
      }

      input {
        width: 100%;
        margin-top: 0.25rem;
      }
    }
    &:last-child {
      flex-basis: 70%;
      flex-grow: 1;
    }
  }
`;

export default Wrapper;