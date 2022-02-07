import styled from 'styled-components';

export const Wrapper = styled.div`
  position: absolute;
  right: 0;
  display: flex;
  flex-flow: row-reverse wrap;
  padding: 1.2rem; 
  transition: all 0.15s;
  &:hover {
    transform: scale(1.03);
  }

  section {
    width: 100%;
    margin-bottom: 0.5rem;
    text-align: right;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-end;
  }

  > div {
    display: flex;
    flex-flow: column wrap;

    button {
      flex: 1;
      border: 1px solid;
      font-size: 1rem;
      padding: 0.3rem 0.75rem;
      margin: 0.2rem 0;
      border-radius: 0.75rem;
      box-shadow: none;
      background: none;
      display: flex;
      flex-flow: row wrap;
      justify-content: flex-end;
      align-items: center;
      cursor: pointer;
      &:hover {
        transform: scale(1.005);
      }
      > div:first-child {
        margin-right: 0.25rem;
      }
    }

    p {
      margin: 0;
      &.label {
        font-size: 0.8rem;
      }
    }
  }
`;

export default Wrapper;