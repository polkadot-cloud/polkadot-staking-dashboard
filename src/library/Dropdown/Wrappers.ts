import styled from 'styled-components';

export const StyledDownshift = styled.div`
  box-sizing: border-box;
  position: relative;
  width: 100%;
  height: 250px;
  overflow: hidden;

  /* title of dropdown */ 
   .label {
    margin: 1rem 0;
    display: block;
  }
  
  /* input element of dropdown */
  .input {
    box-sizing: border-box;
    width: 100%;
  }
`;

export const StyledController = styled.button<any>`
  box-sizing: border-box;
  border: none;
  position: absolute;
  right: 0;
  top: 2rem;
  width: 2.2rem;
  height: 2.2rem;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
  background: #f7f7f7;
  border-radius: 0.5rem;
`;

export const StyledDropdown = styled.div`
  box-sizing: border-box;
  margin: 0 auto;
  border-bottom: none;
  width: 100%;
  height: 150px;
  overflow: auto;

  .item {
    padding: 0.5rem;
    cursor: pointer;
    margin: 0.2rem 0;
    border-radius: 0.75rem;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    align-items: center;

    .icon {
      margin-right: 0.5rem;
    }
  }
`;

export default StyledDropdown;