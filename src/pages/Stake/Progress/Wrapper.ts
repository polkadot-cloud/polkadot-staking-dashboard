import styled from 'styled-components';

export const StyledHeader = styled.div`
  border-bottom: 1px solid #e8e8e8;
  width: 100%;
  padding-bottom: 0.5rem;
  display: flex;
  flex-flow: row nowrap;
  align-items: flex-end;

   > div:last-child {
     flex: 1;
     display: flex;
     justify-content: flex-end;
     font-size: 1.2rem;
     color: #666;
   }
`;

export default StyledHeader;