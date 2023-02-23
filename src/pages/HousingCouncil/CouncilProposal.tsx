import { useAccount } from 'contexts/Account';
import { useApi } from 'contexts/Api';
import { Asset } from 'contexts/Assets/types';
import { useCouncil } from 'contexts/Council';
import { CouncilVoteResult } from 'contexts/Council/types';
import { useNotifications } from 'contexts/Notifications';
import { useVoting } from 'contexts/Voting';
import { AssetProposal } from 'library/AssetProposal';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnyApi } from 'types';

interface CouncilProposalProps {
  asset: Asset;
}

export const CouncilProposal = ({ asset }: CouncilProposalProps) => {
  const { t } = useTranslation('pages');
  const { api } = useApi();
  const { address } = useAccount();
  const { fetchCouncilVotes, isCouncilMember } = useCouncil();
  const { notifyError, notifySuccess } = useNotifications();
  const { fetchProposals } = useVoting();
  const [councilVote, setCouncilVoteResult] = useState<CouncilVoteResult>(null);

  const { proposalHash: hash } = asset;
  const [userVote, setUserVote] = useState<boolean | undefined>();
  const [pending, setPending] = useState(false);
  const [tx, setTx] = useState<AnyApi>(null);
  const [isOver, setOver] = useState(false);

  const initStates = () => {
    setUserVote(undefined);
    setPending(false);
    setTx(null);
    setOver(false);
  };

  const fetchInfo = async () => {
    initStates();
    const { collective } = await fetchProposals(hash);
    if (collective) {
      const votes = await fetchCouncilVotes(collective);
      if (!votes) {
        // voting session is over
        setOver(true);
        return;
      }
      const { ayes, nays } = votes;
      setCouncilVoteResult(votes);
      setUserVote(undefined);
      if (address !== undefined) {
        if (ayes.indexOf(address) !== -1) setUserVote(true);
        if (nays.indexOf(address) !== -1) setUserVote(false);
      }
    }
  };

  const { submitTx } = useSubmitExtrinsic({
    tx,
    from: address as string,
    shouldSubmit: true,
    callbackInBlock: () => {},
    callbackSubmit: () => {},
    callbackSuccess: () => {
      setPending(false);
      notifySuccess(t('council.voteSuccess'));
      fetchInfo();
    },
    callbackError: () => {
      notifyError(t('council.voteFailed'));
      setPending(false);
    },
  });

  const onVote = (_vote: boolean) => {
    if (!api) return;
    setPending(true);
    setTx(api.tx.votingModule.councilVote(hash, _vote));
  };

  const onCloseVote = () => {
    if (!api) return;
    setTx(api.tx.votingModule.councilCloseVote(hash));
  };

  useEffect(() => {
    if (!tx) return;
    setPending(true);
    submitTx();
  }, [tx]);

  useEffect(() => {
    if (api && address) fetchInfo();
  }, [api, address]);

  return !isOver ? (
    <AssetProposal
      asset={asset}
      hash={hash}
      ayes={councilVote?.ayes.length || 0}
      nays={councilVote?.nays.length || 0}
      vote={userVote}
      onVote={onVote}
      threshold={councilVote?.threshold}
      canVote={
        !pending &&
        address !== undefined &&
        isCouncilMember(address) &&
        userVote === undefined
      }
      canClose={!pending && address !== undefined && isCouncilMember(address)}
      onClose={onCloseVote}
    />
  ) : (
    <></>
  );
};
