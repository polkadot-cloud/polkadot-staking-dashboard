import styled from 'styled-components';

export const Wrapper = styled.div`
  position: absolute;
  right: 0;
  display: flex;
  flex-flow: row-reverse wrap;
  padding: 1.2rem; 
  transition: all 0.15s;

  section {
    width: 100%;
    margin-bottom: 0.5rem;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-end;
  }
  > div {
    display: flex;
    flex-flow: column wrap;

    button {
      flex: 1;
      font-size: 1.04rem;
      padding: 0.5rem 1.25rem 0.5rem 0.75rem;
      margin: 0.025rem 0;
      border-radius: 0.85rem;
      box-shadow: none;
      background: rgba(230,230,230,0.9);
      display: flex;
      flex-flow: row wrap;
      justify-content: flex-end;
      align-items: center;
      align-content: center;
      cursor: pointer;

      > div:first-child {
        margin-right: 0.5rem;
        background: #666;
        border-radius: 0.5rem;
        color: #eee;
        padding: 0.2rem 0.5rem;
        font-weight: 600;
        font-size: 0.9rem;
      }
    }
  }
`;

export default Wrapper;