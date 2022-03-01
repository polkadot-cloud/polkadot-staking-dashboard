import styled from 'styled-components';

export const MainWrapper = styled.div`
  flex-basis: 60%;
  max-width: 60%;
  padding-right: 1.5rem;
  overflow: hidden;
  min-width: 500px;
  flex-grow: 1;
`;

export const GraphWrapper = styled.div`
  padding: 1rem 1.2rem;
  border-radius: 1rem;
  background: rgba(255,255,255,0.7);
  display: flex;
  flex-flow: column nowrap;
  align-content: flex-start;
  align-items: flex-start;
  width: 100%;
  flex: 1;
  margin-top: 1rem;

  h1, h5 {
    margin: 0;
    padding: 0.25rem 0;
  }
  h1 {
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    align-items: center;
  }
  p {
    margin: 0;
    padding-top: 0.5rem;

    button {
      background: #f1f1f1;
      border-radius: 0.75rem;
      padding: 0.3rem 0.75rem;
    }
  }
  .graph {
    position: relative;
    flex: 1;
    flex-flow: row wrap;
    justify-content: center;
    width: 100%;
    margin-top: 1.5rem;
  }

  .graph_with_extra {
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: flex-start;
    height: 190px;

    .extra {
      flex: 1;
      display: flex;
      flex-flow: row wrap;
      justify-content: flex-end;
      align-items: flex-end;
      align-content: flex-end;
      height: 190px;
      border: 1px solid;

      .buttons {
        display: flex;
        flex-flow: row wrap;
        justify-content: flex-end;
      }
    }
  }

  .change {
    margin-left: 0.6rem;
    font-size: 0.9rem;
    color: white;
    border-radius: 0.75rem;
    padding: 0.15rem 0.5rem;
    font-variation-settings: 'wght' 550;
    &.pos {
      background: #3eb955;
    }
    &.neg {
      background: #d2545d;
    }
  }
`;

export const SecondaryWrapper = styled.div`
  border-radius: 1rem;
  flex: 1;
  width: 100%;
  min-width: 400px;
`;
