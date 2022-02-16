import styled from 'styled-components';

export const Wrapper = styled.div`
  position: absolute;
  right: 0;
  display: flex;
  flex-flow: row nowrap;
  padding: 1rem  1.2rem; 
  transition: all 0.15s;

  section {
    margin-bottom: 0.5rem;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-end;
    margin-left: 1rem;

    &:first-child {
      margin-left: 0;
    }

    .item {
      flex: 1;
      font-size: 1rem;
      padding: 0rem 1rem 0rem 1rem;
      margin: 0.25rem 0;
      height: 2.3rem;
      border-radius: 0.95rem;
      box-shadow: none;
      background: rgba(230,230,230,0.9);
      display: flex;
      flex-flow: row wrap;
      justify-content: flex-end;
      align-items: center;
      align-content: center;
      cursor: pointer;

      .label {
        background: #333;
        border-radius: 0.5rem;
        color: #eee;
        font-size: 0.95rem;
        font-variation-settings: 'wght' 700;
        margin-right: 0.5rem;
      }

      > div:first-child {
        padding: 0.2rem 0.65rem;
      }
    }
  }
`;

export default Wrapper;