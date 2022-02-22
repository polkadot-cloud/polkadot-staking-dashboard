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
  overflow: hidden;
  box-sizing: border-box;

  * { 
    box-sizing: border-box;
  }
`;

export const SectionsWrapper = styled(motion.div)`
  width: 200%;
  display: flex;
  flex-flow: row nowrap;
  overflow: auto;
  position: relative;
`;

export const ContentWrapper = styled.div`
  border-radius: 1rem;
  display: flex;
  flex-flow: column nowrap;
  flex-basis: 50%;
  background: rgba(225,225,225,0.9);
  backdrop-filter: blur(4px);
  margin: 0.75rem;
`;

export const HeaderWrapper = styled.div`
  width: 100%;
  border-bottom: 1px solid #dadada;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  height: 3rem;
  flex-shrink: 0;

  button {
    border-radius: 1rem;
    border: 1px solid #222;
    color: #222;
    padding: 0.3rem 0.75rem;
    font-size: 0.9rem;
    font-variation-settings: 'wght' 575;
    background: rgba(255,255,255,0.25)
  }

  h3 {
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
  padding: 0.5rem 0.5rem;
`;

export const HeadingWrapper = styled.div`
  width: 100%;
  padding: 0 0.6rem;
  > h4 {
    margin: 0.5rem 0 0;
    padding: 0.5rem 0;
    font-variation-settings: 'wght' 575;
    color: #333;
  }
`;

export const DefinitionWrapper = styled(motion.div) <any>`
  width: 100%;
  display: flex;
  
  > button {
    background: rgba(255,255,255,0.65);
    border-radius: 0.75rem;
    margin: 0.45rem;
    padding: 1rem;
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    position: relative;
    flex: 1;

    > div:first-child {
      display: flex;
      flex-flow: column wrap;
      align-items: flex-start;
      justify-content: center;
      flex: 1;

      > h3 {
        margin: 0;
        text-align: left;
        transition: all 0.2s;
        color: #000;
      }
      > p {
        font-variation-settings: 'wght' 420;
        margin: 0.5rem 0 0 0;
      }
    }
    &:hover {
      > div:last-child {
        transition: color 0.15s;
        color: #d33079;
      }
    }
  }
`;

export const ItemWrapper = styled(motion.div) <any>`
  display: flex;
  width: ${props => props.width};
  height: ${props => props.height === undefined ? `160px` : props.height};
  overflow: auto;

  > * {
    background: rgba(255,255,255,0.65);
    border-radius: 0.75rem;
    flex: 1;
    padding: 0 0.8rem;
    display: flex;
    flex-flow: column nowrap;
    align-items: flex-start;
    justify-content: flex-start;
    border: ${props => props.border === undefined ? `none` : props.border};
    margin: ${props => props.border === undefined ? `0.4rem` : `0.3rem`};
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
      text-align: left;
      transition: all 0.2s;
      color: #000;
    }
  
    > p {
      font-variation-settings: 'wght' 420;
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