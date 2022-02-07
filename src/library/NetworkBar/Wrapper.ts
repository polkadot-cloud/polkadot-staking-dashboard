import styled from 'styled-components';

export const Wrapper = styled.div<any>`
  width: 100%;
  background: white;
  border-top: 2px solid #eee;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: ${props => props.open === true ? `flex-start` : `center`};
  font-size: 0.75rem;
  color: #444;
  position: relative;
  height: ${props => props.open === true ? `200px` : `auto`};

  .row {
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    align-content: center;

    > section {
      padding: 0.5rem 0.5rem;
      &:nth-child(2) {
        flex-grow: 1;
        display: flex;
        flex-flow: row-reverse wrap;
      }
    }
  }

  /* to be replaced with open button */
  .open {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 20px;
    z-index: 1;
  }
`;

export default Wrapper;