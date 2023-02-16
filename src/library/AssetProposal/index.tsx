import { faCopy } from '@fortawesome/free-regular-svg-icons';
import {
  faClock,
  faThumbsDown,
  faThumbsUp,
  faUser,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Asset } from 'contexts/Assets/types';
import { useNotifications } from 'contexts/Notifications';
import { NotificationText } from 'contexts/Notifications/types';
import { useTranslation } from 'react-i18next';
import { clipAddress } from 'Utils';
import { ReactComponent as HouseIcon } from '../../img/fs_icon.svg';
import {
  AssetProposalWrapper,
  HouseIconWrapper,
  ProposalDetailsWrapper,
  ProposalHashWrapper,
  ProposalSummaryWrapper,
  VoteButton,
  VoteStats,
  VoteStatsWrapper,
} from './Wrapper';

interface AssetProposalProps {
  asset: Asset;
  hash: string;
  ayes: number;
  nays: number;
  threshold?: number;
  remaining?: number;
  vote: boolean | undefined;
  canVote: boolean;
  canClose?: boolean;
  onVote: (vote: boolean) => void;
  onClose?: () => void;
}
export const AssetProposal = ({
  asset,
  hash,
  ayes,
  nays,
  vote,
  threshold,
  remaining,
  canVote,
  canClose = false,
  onClose,
  onVote,
}: AssetProposalProps) => {
  const { addNotification } = useNotifications();
  const { t } = useTranslation('pages');

  // click to copy notification
  let notification: NotificationText | null = null;
  if (hash !== undefined) {
    notification = {
      title: t('council.proposalHashCopied'),
      subtitle: hash,
    };
  }

  return (
    <AssetProposalWrapper>
      <div className="inner">
        <HouseIconWrapper>
          <HouseIcon />
        </HouseIconWrapper>
        <ProposalDetailsWrapper>
          <h3 className="asset-name">{asset.metadata}</h3>
          <ProposalSummaryWrapper>
            <ProposalHashWrapper>
              <h3>{`Hash:   ${clipAddress(hash)}`}</h3>
              <button
                type="button"
                className="copy-address"
                onClick={() => {
                  navigator.clipboard.writeText(hash);
                  if (notification) {
                    addNotification(notification);
                  }
                }}
              >
                <FontAwesomeIcon
                  className="copy"
                  icon={faCopy}
                  transform="shrink-1"
                />
              </button>
            </ProposalHashWrapper>
            <VoteStatsWrapper>
              {threshold !== undefined && (
                <VoteStats>
                  <FontAwesomeIcon icon={faUser} />
                  <p>{threshold}</p>
                </VoteStats>
              )}
              <VoteStats>
                <VoteButton
                  voted={vote === true}
                  disabled={!canVote}
                  onClick={() => onVote(true)}
                >
                  <FontAwesomeIcon icon={faThumbsUp} color="green" />
                </VoteButton>
                <p className="ok">{ayes}</p>
              </VoteStats>
              <VoteStats>
                <VoteButton
                  voted={vote === false}
                  disabled={!canVote}
                  onClick={() => onVote(false)}
                >
                  <FontAwesomeIcon icon={faThumbsDown} color="red" />
                </VoteButton>
                <p className="no">{nays}</p>
              </VoteStats>
              {canClose && (
                <VoteButton onClick={() => onClose && onClose()}>
                  <FontAwesomeIcon icon={faXmark} color="black" />
                </VoteButton>
              )}

              {remaining !== undefined && (
                <VoteStats>
                  <FontAwesomeIcon icon={faClock} />
                  <p>{remaining}</p>
                </VoteStats>
              )}
            </VoteStatsWrapper>
          </ProposalSummaryWrapper>
        </ProposalDetailsWrapper>
      </div>
    </AssetProposalWrapper>
  );
};
