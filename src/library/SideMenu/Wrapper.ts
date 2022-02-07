import styled from 'styled-components';

export const Wrapper = styled.div`
  background: #f2f2f2;
  border-radius: 0.6rem;
  transition: all 0.15s;
  padding: 1rem 0.5rem;
  overflow: auto;
  flex: 1;
  margin: 1.5rem 1rem;
  width: 100%;
  &:hover {
    transform: scale(1.005);
  }
`;

export const ItemWrapper = styled.div<any>`
  border-radius: 0.5rem;
  background: ${props => props.active ? `rgba(0,0,0,0.05)` : `none`};
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: center;
  transition: background 0.2s;
  &:hover {
    background: ${props => !props.active ?
    `rgba(0,0,0,0.03)` :
    `rgba(0,0,0,0.05)`
  };
  }
  span {
    margin-right: 0.8rem;
  }
  button {
    padding: 0.4rem;
    margin: 0.4rem 0;
    font-size: 1rem;
  }
`;

export const HeadingWrapper = styled.div<any>`
  margin: 0.75rem 0 0.25rem 0;
  font-size: 0.8rem;
  padding: 0 0.5rem;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: center;
  opacity: 0.6;
`;

export default Wrapper;