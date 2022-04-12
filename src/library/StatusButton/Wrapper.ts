import styled from 'styled-components';

export const Wrapper = styled.button`
  width: 100%;
  flex: 1;
  padding: 1rem 0.75rem;
  border-radius: 0.75rem;
  margin-bottom: 1rem;
  font-size: 1rem;
  display: flex;
  flex-flow: row-reverse wrap;
  align-items: center;
  background: rgba(255,255,255,0.9);
  transition: all 0.15s;

  &:hover {
    background: rgba(255,255,255,0.6);
  }

  > section:last-child {
    padding-left: 0.25rem;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    flex: 1;
    font-variation-settings: 'wght' 420;
  }
`;

export default Wrapper;