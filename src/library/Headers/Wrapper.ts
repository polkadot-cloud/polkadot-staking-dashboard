import { motion } from "framer-motion";
import styled from 'styled-components';

export const Wrapper = styled.div`
  position: absolute;
  right: 0;
  display: flex;
  flex-flow: row nowrap;
  padding: 1rem  1.2rem; 
  transition: all 0.15s;

  /* overwrite default cursor behaviour for Identicon  */
  svg, .ui--IdentityIcon {
    cursor: default;
  }
`;

export const HeadingWrapper = styled.div`
  margin-bottom: 0.5rem;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-end;
  margin-left: 1rem;
  position: relative;

  &:first-child {
    margin-left: 0;
  }

  /* accounts dropdown */
  .accounts {
    position: absolute;
    border-radius: 1.2rem;
    background: rgba(225,225,225,0.5);
    backdrop-filter: blur(4px);
    top: 3rem;
    left: 0;
    width: 100%;
    list-style: none;
    margin: 0;
    padding: 0rem 0.25rem;
    display: flex;
    flex-flow: column wrap;
    box-sizing: border-box;
  }
`;

export const Item = styled(motion.button)`
    flex-grow: 1;  
    padding: 0rem 1.25rem;
    margin: 0.25rem 0;
    border-radius: 1.2rem;
    box-shadow: none;
    background: rgba(225,225,225,0.9);
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    font-variation-settings: 'wght' 540;
    height: 2.3rem;
    font-size: 1rem;

    &.connect {
      background: #d33079;
      color: white;
    }
    .label {
      border: 0.125rem solid #d33079;
      border-radius: 0.8rem;
      color: #d33079;
      font-size: 0.85rem;
      font-variation-settings: 'wght' 525;
      margin-right: 0.6rem;
    }

  > div:first-child {
    padding: 0.15rem 0.6rem;
  }
`;


export default Wrapper;