import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
`;

export const NominateWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  align-items: flex-start;
  position: relative;

  > button {
    display: flex;
    flex-flow: column nowrap;
    flex-basis: 50%;
    align-items: center;
    justify-content: flex-start;
    padding: 1.2rem;
    background: rgba(240,240,240,0.7);
    height: 170px;
    border-radius: 0.85rem;
    &:first-child{
      margin-right: 0.6rem;
    }
    &:last-child{
      margin-left: 0.6rem;
    }
    h2 {
      font-size: 1.2rem;
      color: #222; 
      margin: 0 0 0.4rem;
    }
    p {
      color: #222;
      font-size: 0.88rem;
      line-height: 1.3rem;
      padding: 0.5rem 1rem 0 1rem;
      text-align: center;
      font-variation-settings: 'wght' 500;
    }
    .foot {
      width: 100%;
      display: flex;
      flex-flow: column nowrap;
      align-items: center;
      justify-content: flex-end;
      flex: 1;
    }
    .go {
      color: #555;
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      justify-content: center;
      padding: 0;
      transition: color 0.2s;
    }
    &:hover {
      .go {
        color: #d33079;
      }
    }
  }
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