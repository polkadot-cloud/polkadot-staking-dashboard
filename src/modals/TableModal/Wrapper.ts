import styled from 'styled-components';
import {
  backgroundToggle,
  buttonDisabledBackground,
  buttonDisabledText,
  buttonPrimaryBackground,
  successTransparent,
} from 'theme';

export const RowButton = styled.button<any>`
  background: ${buttonPrimaryBackground};
  box-sizing: border-box;
  padding: 1rem;
  cursor: pointer;
  border-radius: 0.75rem;
  display: inline-flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  border: 1px solid ${successTransparent};
  ${(props) =>
    props.connected !== true &&
    `
  border: 1px solid rgba(0,0,0,0);
`}
  &:hover {
    background: ${backgroundToggle};
  }
  &:disabled {
    background: ${buttonDisabledBackground};
    color: ${buttonDisabledText};
  }
`;

export const TableRowsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 1rem 0;
`;
