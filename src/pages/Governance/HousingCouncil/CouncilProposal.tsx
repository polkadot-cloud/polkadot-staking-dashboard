import { useAccount } from 'contexts/Account';
import { useApi } from 'contexts/Api';
import { Asset } from 'contexts/Assets/types';
import { useCouncil } from 'contexts/Council';
import { useNotifications } from 'contexts/Notifications';
import { useVoting } from 'contexts/Voting';
import { AssetProposal } from 'library/AssetProposal';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

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

  const { proposalHash: hash } = asset;
  const [ayeCount, setAyes] = useState(0);
  const [nayCount, setNays] = useState(0);
  const [userVote, setUserVote] = useState<boolean | undefined>();
  const [vote, setVote] = useState<boolean | undefined>();
  const [pending, setPending] = useState(false);

  const initStates = () => {
    setAyes(0);
    setNays(0);
    setUserVote(undefined);
    setVote(undefined);
    setPending(false);
  };

  const fetchInfo = async () => {
    initStates();
    const { collective } = await fetchProposals(hash);
    if (collective) {
      const { ayes, nays } = await fetchCouncilVotes(collective);
      setAyes(ayes.length);
      setNays(nays.length);
      setUserVote(undefined);
      if (address !== undefined) {
        if (ayes.indexOf(address) !== -1) setUserVote(true);
        if (nays.indexOf(address) !== -1) setUserVote(false);
      }
    }
  };

  const getTx = () => {
    if (!api || vote === undefined) return null;
    return api.tx.votingModule.councilVote(hash, vote);
  };
  const { submitTx } = useSubmitExtrinsic({
    tx: getTx(),
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
    setVote(_vote);
  };

  useEffect(() => {
    setPending(true);
    if (vote !== undefined) submitTx();
  }, [vote]);

  useEffect(() => {
    if (api && address) fetchInfo();
  }, [api, address]);

  return (
    <AssetProposal
      asset={asset}
      hash={hash}
      ayes={ayeCount}
      nays={nayCount}
      vote={userVote}
      onVote={onVote}
      canVote={
        !pending &&
        address !== undefined &&
        isCouncilMember(address) &&
        userVote === undefined
      }
    />
  );
};
