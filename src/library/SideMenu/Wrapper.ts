import styled from 'styled-components';

export const Wrapper = styled.div`
  background: #f2f2f2;
  border-radius: 0.6rem;
  transition: all 0.15s;
  padding: 1rem 0.5rem;
  overflow: auto;
  flex: 1;
  margin: 1.5rem 1rem;
  min-width: 200px;
  &:hover {
    transform: scale(1.005);
  }
  display: flex;
  flex-flow: column nowrap;

  section {
    &:first-child {
      flex-grow: 1;
    }
    &:last-child {
      button {
        transition: color 0.2s;
        margin: 0 0.25rem;
        color: #999;
        &:hover {
        color: #666;
      }
    }
  }
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
  padding: 0.75rem 0.5rem;
  margin: 0.4rem 0;
  font-size: 1rem;

  &:hover {
    background: ${props => !props.active ?
    `rgba(0,0,0,0.03)` :
    `rgba(0,0,0,0.05)`
  };
  }
  span {
    margin-right: 0.8rem;
  }
`;

export const HeadingWrapper = styled.div<any>`
  margin: 1.5rem 0 0.25rem 0;
  font-size: 0.95rem;
  padding: 0 0.5rem;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: center;
  opacity: 0.6;
`;

export const Separator = styled.div`
  border-bottom: 1px solid #ddd;
  margin-bottom: 1rem;
  padding: 0 0.5rem;
`;

export default Wrapper;