import styled from 'styled-components';
import { textPrimary, textSuccess, textWarning } from 'theme';

export const AssetProposalWrapper = styled.div`
  display: flex;
  padding: 0.5rem 1rem;
  flex: 1 0 50%;
  max-width: 50%;
  .inner {
    display: flex;
    flex-direction: row;
    background: rgba(237, 237, 237, 0.6);
    border-radius: 1rem;
  }
`;

export const HouseIconWrapper = styled.div`
  svg {
    width: 5rem;
    height: 5rem;
    border-radius: 0.5rem;
  }
`;

export const ProposalDetailsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 1rem 0.5rem 1rem;
  height: 100%;
  width: 100%;

  .asset-name {
    color: ${textPrimary};
    margin: 0;
  }
`;

export const ProposalSummaryWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const ProposalHashWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  h3 {
    font-size: 1.1rem;
    line-height: 1;
    padding: 0.5rem 0 0 0;
    margin: 0;
    color: ${textSuccess};
  }
`;

export const VoteStatsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2rem;
`;

export const VoteStats = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  p {
    font-size: 1rem;
    padding: 0;
    margin: 0;
  }
  .yes {
    color: ${textSuccess};
  }

  .no {
    color: ${textWarning};
  }

  .yes,
  .no {
    cursor: pointer;
  }

  .yes:hover,
  .no:hover {
    transform: scale(1.2);
  }
`;

export const VoteButton = styled.button<{ voted?: boolean }>`
  border-bottom: ${({ voted }) => (voted ? '1px solid black' : 'none')};
  :enabled:active,
  :enabled:hover {
    transform: scale(1.2);
  }
`;
