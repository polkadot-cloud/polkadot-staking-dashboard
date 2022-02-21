import styled from 'styled-components';

export const MainWrapper = styled.div`
  flex-basis: 66%;
  padding-right: 1.5rem;
  overflow: hidden;
  min-width: 500px;
`;

export const GraphWrapper = styled.div`
  padding: 1.2rem;
  border-radius: 1rem;
  background: rgba(255,255,255,0.8);
  display: flex;
  flex-flow: column nowrap;
  width: 100%;
  flex: 1;
  max-height: 400px;

  h1, h5 {
    margin: 0;
    padding: 0.25rem 0;
  }
  .graph {
    position: relative;
    flex: 1;
    flex-flow: column wrap;
    justify-content: center;
    width: 100%;
    margin-top: 1.5rem;
    min-height: 250px;
  }
`;

export const SecondaryWrapper = styled.div`
  border-radius: 1rem;
  background: rgba(255,255,255,0.8);
  flex-basis: 34%;
  flex: 1;
`;
