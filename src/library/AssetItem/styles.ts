import { SmallFontSizeMaxWidth } from 'consts';
import styled from 'styled-components';
import {
  backgroundDropdown,
  borderPrimary,
  networkColor,
  shadowColorSecondary,
  textDanger,
  textSecondary,
  textSuccess,
} from 'theme';

export const AssetItemWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  width: 100%;
  height: 6rem;
  position: relative;
  margin: 0.5rem;

  > .inner {
    background: ${backgroundDropdown};
    box-shadow: 0px 1.75px 0px 1.25px ${shadowColorSecondary};

    flex: 1;
    border-radius: 1rem;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    align-items: center;
    flex: 1;
    overflow: hidden;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    padding: 0;
    .row {
      flex: 1 0 100%;
      display: flex;
      align-items: center;
      padding: 0 0.5rem;
      height: 3.25rem;

      &.status {
        height: 2.75rem;
      }
      svg {
        margin: 0;
      }
    }
  }
`;

export const TenantAddrWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-grow: 1;
`;

export const MenuPosition = styled.div`
  position: absolute;
  top: -10px;
  right: 10px;
  width: 0;
  height: 0;
  opacity: 0;
`;

export const Labels = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  overflow: hidden;
  flex: 1 1 100%;
  padding: 0 0 0 0.25rem;
  height: 2.75rem;

  button {
    padding: 0 0.1rem;
    @media (min-width: ${SmallFontSizeMaxWidth}px) {
      padding: 0 0.2rem;
    }

    color: ${textSecondary};
    &:hover {
      opacity: 0.75;
    }
    &.active {
      color: ${networkColor};
    }
    &:disabled {
      opacity: 0.35;
    }
  }

  .label {
    position: relative;
    display: flex;
    align-items: center;
    color: ${textSecondary};
    margin: 0 0.2rem;
    @media (min-width: ${SmallFontSizeMaxWidth}px) {
      margin: 0 0.2rem;
      &.pool {
        margin: 0 0.4rem;
      }
    }
    button {
      font-size: 1.1rem;
    }
    &.button-with-text {
      margin-right: 0;

      button {
        color: ${networkColor};
        font-size: 0.95rem;
        display: flex;
        flex-flow: row wrap;
        align-items: center;

        > svg {
          margin-left: 0.3rem;
        }
      }
    }

    &.warning {
      color: #d2545d;
      display: flex;
      flex-flow: row wrap;
      align-items: center;
      padding-right: 0.35rem;
    }
  }
`;

export const AssetName = styled.div`
  font-size: 1.2rem;
  line-height: 1;
  padding-left: 1rem;
  flex-grow: 1;
`;

export const InfoItem = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
  padding: 8px;
  .rep {
    color: ${textSuccess};
  }
  .no-rep {
    color: ${textDanger};
  }
`;

export const Separator = styled.div`
  width: 100%;
  height: 1px;
  border-bottom: 1px solid ${borderPrimary};
  opacity: 0.7;
`;

export const StatusWrapper = styled.div<{ status: string }>`
  color: ${({ status }) => {
    switch (status) {
      case 'SLASH':
        return textDanger;
      case 'REJECTED':
        return textDanger;
      default:
        return textSuccess;
    }
  }};
`;
