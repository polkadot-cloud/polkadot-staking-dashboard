import styled from 'styled-components';

export const Wrapper = styled.div`
  position: absolute;
  right: 0;
  display: flex;
  flex-flow: row nowrap;
  padding: 1rem  1.2rem; 
  transition: all 0.15s;

  section {
    margin-bottom: 0.5rem;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-end;
    margin-left: 1rem;

    &:first-child {
      margin-left: 0;
    }

    .item {
      flex: 1;
      font-size: 1rem;
      padding: 0rem 1rem 0rem 1rem;
      margin: 0.25rem 0;
      height: 2.3rem;
      border-radius: 1.2rem;
      box-shadow: none;
      background: rgba(225,225,225,0.9);
      display: flex;
      flex-flow: row wrap;
      justify-content: flex-end;
      align-items: center;
      align-content: center;
      cursor: pointer;
      font-variation-settings: 'wght' 490;

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
    }
  }

  /* overwrite default cursor behaviour for Identicon  */
  svg, .ui--IdentityIcon {
    cursor: default;
  }
`;

export default Wrapper;