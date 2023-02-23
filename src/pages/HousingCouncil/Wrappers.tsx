import styled from 'styled-components';
import { backgroundModalItem, shadowColorSecondary } from 'theme';

export const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: flex-start;
`;

export const CouncilListWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
`;

export const CouncilorWrapper = styled.div`
  display: flex;
  position: relative;
  margin: 0.5rem;
  background: rgba(237, 237, 237, 0.6);
  flex: 1 0 30%;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;

  > .inner {
    background: ${backgroundModalItem};
    box-shadow: 0px 1.75px 0px 1.25px ${shadowColorSecondary};

    box-shadow: none;
    border: none;
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
  }
`;

export const AddressWrapper = styled.p`
  font-size: 1.2rem;
`;

export const RowWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  gap: 0.5rem;
  align-items: center;
`;

export const ProposalList = styled.div`
  display: flex;
  flex-flow: row wrap;
  width: 100%;
  margin-top: 1rem;
`;

export const CouncilVoteItemWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  gap: 8px;
`;
