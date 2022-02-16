import { motion } from "framer-motion";
import styled from 'styled-components';
import { MAX_ASSISTANT_INTERFACE_WIDTH } from '../../constants';

export const Wrapper = styled(motion.div) <any>`
  position: absolute;
  right: -600px;
  top: 0;
  width: 100%;
  max-width: ${MAX_ASSISTANT_INTERFACE_WIDTH}px;
  height: 100%;
  z-index: 2;
  display: flex;
  flex-flow: column nowrap;
`;

export const ContentWrapper = styled.div`
  border-radius: 0.8rem;
  display: flex;
  flex-flow: column nowrap;
  overflow: hidden;
  flex-grow: 1;
  background: rgba(225,225,225,0.96);
  margin: 0.75rem;
`;

export const HeaderWrapper = styled.div`
  width: 100%;
  border-bottom: 1px solid #ccc;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  height: 3rem;
  flex-shrink: 0;


  > h3 {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    padding: 0 1rem;
    margin: 0;
    
    span {
      flex-grow: 1;
      display: flex;
      flex-flow: row wrap;
      justify-content: flex-end;
      align-items: center;
    }
    svg {
      margin-left: 0.5rem;
    }
  }
`;

export const ListWrapper = styled(motion.div)`
  display: flex;
  flex-flow: row wrap;
  flex-grow: 1;
  align-content: flex-start;
  overflow: auto;
  padding: 0.25rem 0.5rem;
`;

export const ItemWrapper = styled(motion.div) <any>`
  display: flex;
  width: ${props => props.width};
  height: ${props => props.height === undefined ? `180px` : props.height};
  overflow: auto;

  .item {
    background: #f8f8f8;
    border-radius: 1rem;
    flex: 1;
    margin: 0.3rem;
    padding: 0 0.75rem;
    display: flex;
    flex-flow: column nowrap;
    align-items: flex-start;
    border: ${props => props.actionRequired === true ? `3px solid #d33079` : `2px solid #d9d9d9`};
    position: relative;

    > h4 {
      font-weight: normal;
      margin: 0.65rem 0;
      color: #666;
      text-transform: uppercase;
      font-size: 0.7rem;
    }
    > h3 {
      margin: 0;
    }

    .ext {
      position: absolute;
      bottom: 0.7rem;
      right: 0.7rem;
      transition: all 0.2s;
    }
    &:hover {
      .ext {
        color: #d33079;
      }
    }
  }
`;

export default Wrapper;